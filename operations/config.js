/** Route parameters */
module.exports = {
    routesFields: {
        signin: [
            {
                key: "username",
                isRequired: true,
                type: "string"
            },
            {
                key: "password",
                isRequired: true,
                type: "string"
            }
        ],
        social_login: [
            {
                key: "social_media_name",
                isRequired: true,
                type: "string"
            },
            {
                key: "social_media_id",
                isRequired: true,
                type: "string"
            }
        ],
        signup: [
            {
                key: "username",
                isRequired: true,
                type: "string"
            },
            {
                key: "email",
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
        ],
        forgot_password: [
            {
                key: "username",
                isRequired: true,
                type: "string"
            }
        ],
        profile: [
            {
                key: "user_token",
                isRequired: true,
                type: "string"
            }
        ],
        editprofile: [
            {
                key: "user_token",
                isRequired: true,
                type: "string"
            },
            {
                key: "mobile_number",
                isRequired: false,
                type: "number"
            },
            {
                key: "looking_for",
                isRequired: false,
                type: "enum",
                data: ["men", "women"]
            },
            {
                key: "lifestyle_expectation",
                isRequired: false,
                type: "enum",
                data: ["4ft - 121 cm", "4ft 1in - 124cm", "4ft 2in - 127cm", "4ft 3in - 129cm", "4ft 4in - 132cm", "4ft 5in - 134cm", "4ft 6in - 137cm", "4ft 7in - 139cm", "4ft 8in - 142cm", "4ft 9in - 144cm", "4ft 10in - 147cm", "4ft 11in - 149cm", "5ft - 152cm", "5ft 1in - 154cm", "5ft 2in - 157cm", "5ft 3in - 160cm", "5ft 4in - 162cm", "5ft 5in - 165cm", "5ft 6in - 167cm", "5ft 7in - 170cm", "5ft 8in - 172cm", "5ft 9in - 175cm", "5ft 10in - 177cm", "5ft 11in - 180cm", "6ft - 182cm", "6ft 1in - 185cm", "6ft 2in - 187cm", "6ft 3in - 190cm", "6ft 4in - 193cm", "6ft 5in - 195cm", "6ft 6in - 198cm", "6ft 7in - 200cm", "6ft 8in - 203cm", "6ft 9in - 205cm", "6ft 10in - 208cm", "6ft 11in - 210cm", "7ft - 213cm"]
            },
            {
                key: "social_media_name",
                isRequired: false,
                type: "string"
            },
            {
                key: "about_me",
                isRequired: false,
                type: "string"
            },
            {
                key: "hair_color",
                isRequired: false,
                type: "string"
            },
            {
                key: "eye_color",
                isRequired: false,
                type: "string"
            },
            {
                key: "occupation",
                isRequired: false,
                type: "string"
            },
            {
                key: "what_he_is_looking_for",
                isRequired: false,
                type: "string"
            },
            {
                key: "relationship_status",
                isRequired: false,
                type: "enum",
                data: ["single", "double"]
            },
            {
                key: "isPrivate",
                isRequired: false,
                type: "boolean"
            },
            {
                key: "profile_image_url",
                isRequired: false,
                type: "string"
            },
            {
                key: "ethniicty",
                isRequired: false,
                type: "string"
            },
            {
                key: "body_type",
                isRequired: false,
                type: "enum",
                data: ["Ethlitic", "Average", "Heavy", "Slim"]
            },
            {
                key: "education",
                isRequired: false,
                type: "string"
            },
            {
                key: "children",
                isRequired: false,
                type: "number"
            },
            {
                key: "smokes",
                isRequired: false,
                type: "boolean"
            },
            {
                key: "drinks",
                isRequired: false,
                type: "number"
            },
            {
                key: "location",
                isRequired: false,
                type: "object"
            }
        ],
        search: [
            {
                key: "token",
                isRequired: true,
                type: "string"
            },
            {
                key: "latitude",
                isRequired: true,
                type: "number"
            },
            {
                key: "longitude",
                isRequired: true,
                type: "number"
            }
        ],
        request: [
            {
                key: "user_token",
                isRequired: true,
                type: "string"
            },
            {
                key: "user_id",
                isRequired: true,
                type: "string"
            }
        ],
        response: [
            {
                key: "user_token",
                isRequired: true,
                type: "string"
            },
            {
                key: "requestId",
                isRequired: true,
                type: "string"
            },
            {
                key: "requestStatus",
                isRequired: true,
                type: "boolean"
            }
        ]
    }
}