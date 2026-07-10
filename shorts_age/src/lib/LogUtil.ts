

export function Logger(message : string) {

    const IS_DEBUG = import.meta.env.VITE_IS_DEBUG === "true";

    if(IS_DEBUG){
        console.log(message);
    }
}

export function LoggerShowing(message : string,isShow : boolean) {

    const IS_DEBUG = import.meta.env.VITE_IS_DEBUG === "true";

    if(IS_DEBUG){
        console.log(message);
    }
}
