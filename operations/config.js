/** Route parameters */
module.exports = {
    routesFields: {
        signin: [
            {
                key: "email",
                isRequired: true,
                type: "string"
            },
            {
                key: "password",
                isRequired: false,
                type: "number"
            },]
    }
}