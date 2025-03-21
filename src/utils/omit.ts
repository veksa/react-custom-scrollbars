export function omit(object: Record<string, any>, omitKeys: string[]) {
    const allKeys = Object.keys(object);

    const result: Record<string, string> = {};

    for (let i = 0, ln = allKeys.length; i !== ln; i++) {
        const key = allKeys[i];
        if (omitKeys.indexOf(key) === -1) {
            result[key] = object[key];
        }
    }

    return result;
}
