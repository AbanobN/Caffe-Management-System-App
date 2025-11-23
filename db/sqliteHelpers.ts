import { getDB } from './index';

export interface QueryResultRow {
    [column: string]: any;
}

// New type (because expo-sqlite does not export RunResult)
export interface RunResult {
    lastInsertRowId: number;
    changes: number;
}

export async function queryAll(
    sql: string,
    params: any[] = []
): Promise<QueryResultRow[]> {
    const db = await getDB();
    const rows = await db.getAllAsync<QueryResultRow>(sql, params);
    return rows;
}

export async function queryFirst(
    sql: string,
    params: any[] = []
): Promise<QueryResultRow | null> {
    const db = await getDB();
    const row = await db.getFirstAsync<QueryResultRow>(sql, params);
    return row ?? null;
}

export async function run(
    sql: string,
    params: any[] = []
): Promise<RunResult> {
    const db = await getDB();
    const result = await db.runAsync(sql, params);

    return {
        lastInsertRowId: result.lastInsertRowId,
        changes: result.changes,
    };
}
