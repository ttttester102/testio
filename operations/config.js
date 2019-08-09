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
                isRequired: false,
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
                key: "password",
                isRequired: true,
                type: "any"
            },
            {
                key: "mobile_number",
                isRequired: true,
                type: "number"
            },
            {
                key: "social_media_name",
                isRequired: false,
                type: "string"
            },
            {
                key: "social_media_id",
                isRequired: false,
                type: "string"
            }
        ],
        detail: [
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
                type: "string"
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