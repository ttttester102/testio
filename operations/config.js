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
            }
        ],
        signup: [
            {
                key: "username",
                isRequired: true,
                type: "string"
            },
            {
                key: "password",
                isRequired: true,
                type: "any"
            },
            {
                key: "mobile_number",
                isRequired: true,
                type: "number"
            }
        ]
    }
}