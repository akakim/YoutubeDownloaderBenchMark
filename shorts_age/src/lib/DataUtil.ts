export function IDMakerForDB(prefix : string,alias: string) {

    if( prefix === null || prefix === undefined ){
        throw Error("prefix must exist");
    }

    return `${prefix}_${alias}_${crypto.randomUUID()}`;
}
