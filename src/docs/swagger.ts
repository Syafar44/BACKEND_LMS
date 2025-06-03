import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        version: "v1.0.0",
        title: "Dokumentasi Api LMS Panglima",
        description: "Dokumentasi Api RGP",
    },
    servers: [
        {
            url: "http://localhost:5555/api",
            description: "Local server"
        },
        {
            url: "https://backend-lms-panglima.vercel.app/api",
            description: "Deploy server"
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme : "bearer"
            }
        },
        schemas: {
            LoginRequest: {
                email: "syafar@panglimaunivercity.com",
                password: "26/11/04"
            },
            RegisterRequest: {
                fullName: "syafaruddin",
                email: "syafar@panglimaunivercity.com",
                access: "outlet",
                password: "26/11/04",
                confirmPassword: "26/11/04"
            },
            CreateCompetencyRequest: {
                main_competency: "mainCompetencyId",
                title: "Competency 1",
                description: "Description 1",
                image: "https://picsum.photos/id/1/200/300",
                access: ["outlet", "gerai"],
            },
            CreateSubCompetencyRequest: {
                byCompetency: "competencyId",
                title: "#1 Competency 1",
                description: "Description 1",
                image: "https://picsum.photos/id/1/200/300",
                video: "https://picsum.photos/id/1/200/300",
            },
            CreateKuisCompetencyRequest: {
                bySubCompetency: "competencyId",
                question: "#1 Competency 1",
                option1: "lorem ipsum dolor sit amet",
                option2: "lorem ipsum dolor sit amet",
                option3: "lorem ipsum dolor sit amet",
                option4: "lorem ipsum dolor sit amet",
                optionValid: 1,
            },
            RemoveMediaRequest: {
                fileUrl: "fileUrl"
            }
        }
    }
}

const outputFile = "./swagger_output.json"
const endpointsFiles = ["../routes/api.ts"]


swaggerAutogen({ openapi: "3.0.0"})(outputFile, endpointsFiles, doc)