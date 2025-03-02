import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

const searchFields: any = {
    "user": ["name", "email", "phone"],
    "area": ["name"],
    "city": ["name", "country"],
    "project": ["name", "description"],
    "property": ["name", "description"],
}

const realtions: any = {
    "user": [
        { field: "cities", table: "city" },
        { field: "areas", table: "area" },
        { field: "projects", table: "project" },
        { field: "properties", table: "property" },
    ],
    "city": [
        { field: "createdBy", table: "user" },
        { field: "areas", table: "area" },
    ],
    "area": [
        { field: "createdBy", table: "user" },
        { field: "cityId", table: "city" },
        { field: "projects", table: "project" },
    ],
    "project": [
        { field: "createdBy", table: "user" },
        { field: "areaId", table: "area" },
        { field: "properties", table: "property" },
    ],
    "property": [
        { field: "createdBy", table: "user" },
        { field: "projectId", table: "project" },
    ],
}

class ApiFeatures<T extends ObjectLiteral> {
    private queryBuilder: SelectQueryBuilder<T>;
    private queryData: any;
    private tableAlias: string;
    page: number;
    size: number;

    constructor(queryBuilder: SelectQueryBuilder<T>, tableAlias:string, queryData: any) {
        this.queryBuilder = queryBuilder;
        this.tableAlias = tableAlias;
        this.queryData = queryData;
    }

    paginate(): this {
        let { page, size } = this.queryData;
        this.page = parseInt(page);
        this.size = parseInt(size);
        if (!this.page || this.page <= 0) this.page = 1;
        if (!this.size || this.size <= 0) this.size = 20;
        if (this.size > 40) this.size = 40;
        const skip = (this.page - 1) * this.size;

        this.queryBuilder.take(this.size).skip(skip);
        return this;
    }

    filter(): this {
        const excludeQueryParams = ['page', 'size', 'sort', 'fields', 'details', 'search'];
        const filterQuery = { ...this.queryData };
        const parameters: Record<string, any> = {}; // Store dynamic parameters
        const conditions: string[] = []; // Store dynamic WHERE conditions
        
        excludeQueryParams.forEach(param => delete filterQuery[param]);
        let c = 0;
        Object.entries(filterQuery).forEach(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
                Object.entries(value).forEach(([operator, val]) => {
                    const op = this.getOperator(operator);
                    if(op=="BETWEEN"){
                        if(val.split(',').length==2){
                            const [mini, maxi] = val.split(',');
                            conditions.push(`${this.tableAlias}.${key} ${op} :mini${c} AND :maxi${c}`)
                            parameters[`mini${c}`] = mini;
                            parameters[`maxi${c}`] = maxi;
                            c++;
                            // this.queryBuilder.andWhere(`${this.tableAlias}.${key} ${op} :${key}mini AND :${key}maxi`, { mini, maxi });
                        } 
                    }
                    else {
                        // this.queryBuilder.andWhere(`${this.tableAlias}.${key} ${op} ${op=='IN'||op=='NOT IN'? `(:...value)`: `:value`}`, { value: op=='IN'||op=='NOT IN'? val.split(','): val });
                        conditions.push(`${this.tableAlias}.${key} ${op} ${op=='IN'||op=='NOT IN'? `(:...value${c})`: `:value${c}`}`)
                        parameters[`value${c}`] = (op=='IN'||op=='NOT IN'? val.split(','): val);
                        c++;
                    }
                });
            } else {
                this.queryBuilder.andWhere(`${this.tableAlias}.${key} = :value`, { value });
                conditions.push(`${this.tableAlias}.${key} = :value${c}`)
                parameters[`value${c}`] = value;
                c++
            }
        });
        
        this.queryBuilder.where(conditions.join(" AND "), parameters)
        // console.log("SQL  =======  " + this.queryBuilder.getSql());
        return this;
    }

    private getOperator(operator: string): string {
        const operatorMap: Record<string, string> = {
            gt: '>',
            gte: '>=',
            lt: '<',
            lte: '<=',
            eq: '=',
            neq: '<>',
            in: 'IN',
            nin: 'NOT IN',
            range: 'BETWEEN',
        };
        return operatorMap[operator] || '=';
    }

    sort(): this {
        if (this.queryData.sort) {
            type orderType = { field:string, order:string }
            const orderBys:orderType[] = this.queryData.sort.split(',').map((field: string) => {
                return field.startsWith('-')
                    ? { field: field.substring(1), order: 'DESC' }
                    : { field, order: 'ASC' };
            });
            orderBys.forEach(({ field, order }) => {
                this.queryBuilder.addOrderBy(`${this.tableAlias}.${field}`, order as 'ASC' | 'DESC');
            });
        }
        return this;
    }

    select(): this {
        if (this.queryData.fields) {
            const AllFields = this.queryData.fields.split(',').map((field: string) => `${field.trim()}`);
            
            // Select Some Fields from table
            const AllRelationFieldsSet = new Set(realtions[this.tableAlias].map((item: {field:string, table:string}) => item.field));
            let selectFields = AllFields.filter((item: string) => !AllRelationFieldsSet.has(item));
            if(selectFields.includes('id')) selectFields[selectFields.indexOf('id')] = "_id"; 
            if(!selectFields.includes('_id')) selectFields.push('_id');
            selectFields = selectFields.map((item:string) => `${this.tableAlias}.${item}`)
            this.queryBuilder.select(selectFields)
            
            // Apply join with other tables
            const relationFields = realtions[this.tableAlias].filter((item: { field: string }) => AllFields.includes(item.field));
            relationFields.forEach((item: {field:string, table:string}) => {
                this.queryBuilder.leftJoinAndSelect(`${this.tableAlias}.${item.field}`, item.table);
            });
        }
        return this;
    }

    search(): this {
        const searchField: string[] = searchFields[this.tableAlias];
        if (this.queryData.search) {
            // '(LOWER(title) LIKE :search OR LOWER(description) LIKE :search)',
            let searchQuary: string = `(LOWER(${this.tableAlias}.${searchField[0]}) LIKE :search`
            if(searchField.length > 1){
                for(let i=1; i<searchField.length; i++) searchQuary+=` OR LOWER(${this.tableAlias}.${searchField[i]}) LIKE :search`
            }
            searchQuary += ')';
            
            this.queryBuilder.andWhere(
                searchQuary,
                { search: `%${this.queryData.search.toLowerCase()}%` }
            );
        }
        return this;
    }
}


export default ApiFeatures;