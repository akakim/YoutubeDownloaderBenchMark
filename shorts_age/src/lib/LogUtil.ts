

export function Logger(message : string) {

    const IS_DEBUG = import.meta.env.VITE_IS_DEBUG === "true";

    if(IS_DEBUG){
        console.log(message);
    }
}

export function LoggerShowing(message : string,isShow : boolean) {

    if(isShow){
        Logger(message);
    }
}

export function indexedDBDebug(obj : Object){

    LoggerShowing(JSON.stringify(obj, null, 2),true)
} 


