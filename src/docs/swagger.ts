import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        version: "v1.0.0",
        title: "Dokumentasi Api LMS Panglima",
        description: "Dokumentasi Api lms",
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
                email: "syafar@mail.com",
                password: "123456789"
            },
            RegisterRequest: {
                fullName: "syafaruddin",
                email: "syafar@mail.com",
                access: "outlet",
                department: "Marketing",
                password: "123456789",
                confirmPassword: "123456789"
            },
            UpdatePasswordRequest:{
                currentPassword: "123456789",
                newPassword: "26/11/04",
                confirmPassword: "26/11/04"
            },
            UpdateUserAdminRequest:{
                fullName: "syafaruddin2",
                email: "syafar@panglimaunivercity.com",
                access: "gerai",
            },
            UpdatePasswordAdminRequest:{
                newPassword: "26/11/04",
            },
            CreateKajianRequest: {
                title: "Kajian 1",
                description: "Description 1",
                image: "https://picsum.photos/id/1/200/300",
                video: "https://picsum.photos/id/1/200/300",
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
            CreateScoreRequest: {
                bySubCompetency: "subCompetencyId",
                isPass: true,
                total_question: 5,
                total_score: 5
            },
            CreateVideoRequest: {
                bySubCompetency: "subCompetencyId",
                viewed: true
            },
            CreateResumeRequest: {
                kajian: "kajianId",
                resume: "lorem ipsum dolor sit amet",
            },
            CreateSaveRequest: {
                competency: "competencyID",
                progress: 1
            },
            CreateCompletedRequest: {
                competency: "competencyID",
            },
            CreateAbsenRequest: {
                subuh: "Tidak mengerjakan",
                dzuhur: "Dikerjakan secara berjamaah",
                ashar: "Dikerjakan secara berjamaah",
                magrib:  "Dikerjakan namun tidak berjamaah",
                isya:  "Dikerjakan namun tidak berjamaah",
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