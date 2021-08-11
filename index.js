const fs = require("fs")

module.exports = class Database {
    constructor(filename) {
        this.filename = filename + ".json";
        this.database = require("./" + filename + ".json");
    };

    set(key, value) {
        function set(key, value, object) {
            key = key.split(".");
            const length = key.length;
            const lastIndex = length - 1;

            let index = -1;
            let nested = object;

            while (nested != null && ++index < length) {
                const data = key[index];
                let newValue = value;

                if (index != lastIndex) {
                    const objValue = nested[data];
                    newValue = (typeof objValue === "object") ? objValue : {};
                };
                nested[data] = newValue;
                nested = nested[data];
            };

            return (index && index == length) ? object : undefined;
        };

        fs.writeFileSync(this.filename, JSON.stringify(set(key, value, this.database)));
        return set(key, value, this.database);
    };

    get(key) {
        function get(key, object) {
            key = key.split(".");
            const length = key.length;

            let index = 0;

            while (object != null && index < length) {
                object = object[key[index++]];
            };

            return (index && index == length) ? object : undefined;
        };

        return get(key, this.database);
    };

    delete(key) {
        function unset(key, object) {
            let prop = key.split(".");
            let propLength = prop.length;
            let current = object;
            let i = 0;
            while (i < propLength) {
                if (i === propLength - 1) {
                    delete current[prop[i]];
                    return object;
                } else {
                    current = current[prop[i]];
                }
                i++;
            }
        }

        fs.writeFileSync(this.filename, JSON.stringify(unset(key, this.database)));
        return unset(key, this.database);
    };
};
