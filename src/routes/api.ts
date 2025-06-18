import express from 'express';
import authController from '../controllers/auth.controller';
import authMiddleware from '../middleware/auth.middleware'
import mediaMiddleware from '../middleware/media.middleware';
import mediaController from '../controllers/media.controller';
import aclMiddleware from '../middleware/acl.middleware';
import { ROLES } from '../utils/constant';
import competencyController from '../controllers/competency.controller';
import subCompetencyController from '../controllers/subCompetency.controller';
import kuisCompetencyController from '../controllers/kuisCompetency.controller';
import kajianController from '../controllers/kajian.controller';
import { uploadExcel } from '../middleware/upload.middleware';
import scoreController from '../controllers/score.controller';
import videoController from '../controllers/video.controller';


const router = express.Router();

router.post('/auth/register', authController.register
    /**
        #swagger.tags = ['Auth']
        #swagger.requestBody = {
            required: true, 
            schema: {$ref: "#/components/schemas/RegisterRequest"}
        }
    */
);
router.post('/auth/login', authController.login
    /**
     #swagger.tags = ['Auth']
     #swagger.requestBody = {
            required: true, 
            schema: {$ref: "#/components/schemas/LoginRequest"}
        }
        */
);
router.get('/auth/me', authMiddleware, authController.me
    /**
     #swagger.tags = ['Auth']
     #swagger.security = [{
            "bearerAuth": []
        }]
        */
    )
    router.get('/auth/user', authController.findAll
    /**
     #swagger.tags = ['Auth']
     #swagger.security = [{
        "bearerAuth": []
    }]
    */
)
router.get('/auth/user/:id', authController.findById
    /**
     #swagger.tags = ['Auth']
     #swagger.security = [{
        "bearerAuth": []
    }]
    */
)
router.put('/auth/user/:id', authController.updateUser
    /**
     #swagger.tags = ['Auth']
     #swagger.security = [{
        "bearerAuth": []
    }]
    #swagger.requestBody = {
        required: true, 
        schema: {$ref: "#/components/schemas/UpdateUserAdminRequest"}
    }
    */
)
router.put('/auth/password', authMiddleware ,authController.updatePassword
    /**
        #swagger.tags = ['Auth']
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.requestBody = {
            required: true, 
            schema: {$ref: "#/components/schemas/UpdatePasswordRequest"}
        }
    */
);
router.put('/auth/password/:id', authMiddleware ,authController.adminUpdatePassword
    /**
        #swagger.tags = ['Auth']
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.requestBody = {
            required: true, 
            schema: {$ref: "#/components/schemas/UpdatePasswordAdminRequest"}
        }
    */
);
router.delete('/auth/user/:id', authController.deleteUser
    /**
        #swagger.tags = ['Auth']
        #swagger.security = [{
            "bearerAuth": []
        }]
    */
)
router.post(
  '/auth/register/bulk',
  uploadExcel.single("file"),
  authController.bulkRegister
/*
    #swagger.tags = ['Auth']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.consumes = ['multipart/form-data']
    #swagger.requestBody = {
        required: true,
        content: {
            "multipart/form-data": {
                schema: {
                    type: "object",
                    properties: {
                        file: {
                            type: "string",
                            format: "binary"
                        }
                    }
                }
            }
        }
    }
  */
);

/// KAJIAN
router.post('/kajian', kajianController.create
    /*
    #swagger.tags = ['Kajian']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateKajianRequest"
        }
    }
    */
)
router.get('/kajian', kajianController.findAll
    /*
    #swagger.tags = ['Kajian']
    */
)
router.get('/kajian/:id', kajianController.findOne
    /*
    #swagger.tags = ['Kajian']
    */
)
router.put('/kajian/:id', kajianController.update
    /*
    #swagger.tags = ['Kajian']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateCompetencyRequest"
        }
    }
    */
)
router.delete('/kajian/:id', kajianController.remove
    /*
    #swagger.tags = ['Kajian']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/kajian/:slug/slug', kajianController.findOneBySlug
    /*
    #swagger.tags = ['Kajian']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)

/// COMPETENCY
router.post('/competency', competencyController.create
    /*
    #swagger.tags = ['Competency']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateCompetencyRequest"
        }
    }
    */
)
router.get('/competency', competencyController.findAll
    /*
    #swagger.tags = ['Competency']
    */
)
router.get('/competency/:id', competencyController.findOne
    /*
    #swagger.tags = ['Competency']
    */
)
router.put('/competency/:id', competencyController.update
    /*
    #swagger.tags = ['Competency']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateCompetencyRequest"
        }
    }
    */
)
router.delete('/competency/:id', competencyController.remove
    /*
    #swagger.tags = ['Competency']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/competency/:slug/slug', competencyController.findOneBySlug
    /*
    #swagger.tags = ['Competency']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/competency/:main_competency/main_competency', competencyController.findByMainCompetency
    /*
    #swagger.tags = ['Competency']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)


/// SUB COMPETENCY
router.post('/subcompetency', subCompetencyController.create
    /*
    #swagger.tags = ['Sub Competency']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateSubCompetencyRequest"
        }
    }
    */
)
router.get('/subcompetency', subCompetencyController.findAll
    /*
    #swagger.tags = ['Sub Competency']
    */
)
router.get('/subcompetency/:id', subCompetencyController.findOne
    /*
    #swagger.tags = ['Sub Competency']
    */
)
router.put('/subcompetency/:id', subCompetencyController.update
    /*
    #swagger.tags = ['Sub Competency']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateSubCompetencyRequest"
        }
    }
    */
)
router.delete('/subcompetency/:id', subCompetencyController.remove
    /*
    #swagger.tags = ['Sub Competency']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/subcompetency/:slug/slug', subCompetencyController.findOneBySlug
    /*
    #swagger.tags = ['Sub Competency']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/subcompetency/:competencyId/competencyId', subCompetencyController.findAllByCompetency
    /*
    #swagger.tags = ['Sub Competency']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)

/// KUIS COMPETENCY
router.post('/kuiscompetency', kuisCompetencyController.create
    /*
    #swagger.tags = ['Kuis Competency']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateKuisCompetencyRequest"
        }
    }
    */
)
router.get('/kuiscompetency', kuisCompetencyController.findAll
    /*
    #swagger.tags = ['Kuis Competency']
    */
)
router.get('/kuiscompetency/:id', kuisCompetencyController.findOne
    /*
    #swagger.tags = ['Kuis Competency']
    */
)
router.put('/kuiscompetency/:id', kuisCompetencyController.update
    /*
    #swagger.tags = ['Kuis Competency']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateKuisCompetencyRequest"
        }
    }
    */
)
router.delete('/kuiscompetency/:id', kuisCompetencyController.remove
    /*
    #swagger.tags = ['Kuis Competency']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/kuiscompetency/:subCompetencyId/subCompetencyId', kuisCompetencyController.findAllBySubCompetency
    /*
    #swagger.tags = ['Kuis Competency']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)

/// SCORE
router.post('/score', authMiddleware , scoreController.create
    /*
    #swagger.tags = ['Score']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateScoreRequest"
        }
    }
    */
)
router.get('/score', scoreController.findAll
    /*
    #swagger.tags = ['Score']
    */
)
router.get('/score/:id', scoreController.findOne
    /*
    #swagger.tags = ['Score']
    */
)
router.put('/score/:id', scoreController.update
    /*
    #swagger.tags = ['Score']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateScoreRequest"
        }
    }
    */
)
router.delete('/score/:id', scoreController.remove
    /*
    #swagger.tags = ['Score']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)

router.get('/score/:subCompetency/subCompetency', authMiddleware,  scoreController.findAllBySubCompetency
    /*
    #swagger.tags = ['Score']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)

/// VIDEO
router.post('/video', authMiddleware , videoController.create
    /*
    #swagger.tags = ['Video']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateVideoRequest"
        }
    }
    */
)
router.get('/video', videoController.findAll
    /*
    #swagger.tags = ['Video']
    */
)
router.get('/video/:id', videoController.findOne
    /*
    #swagger.tags = ['Video']
    */
)
router.put('/video/:id', videoController.update
    /*
    #swagger.tags = ['Video']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateVideoRequest"
        }
    }
    */
)
router.delete('/video/:id', videoController.remove
    /*
    #swagger.tags = ['Video']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)

router.get('/video/:subCompetency/subCompetency', authMiddleware,  videoController.findAllBySubCompetency
    /*
    #swagger.tags = ['Video']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)

/// MEDIA

router.post('/media/upload-single', [
    mediaMiddleware.single('file')
], mediaController.single
    /* 
    #swagger.tags = ['Media']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        content: {
            "multipart/form-data": {
                schema: {
                    type: "object",
                    properties: {
                        file: {
                            type: "string",
                            format: "binary"
                        }
                    }
                }
            }
        }
    }
    */
)

router.post('/media/upload-multiple', [
    mediaMiddleware.multiple('files')
], mediaController.multiple
    /*
    #swagger.tags = ['Media']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        content: {
            "multipart/form-data": {
                schema: {
                    type: "object",
                    properties: {
                        files: {
                            type: "array",
                            items: {
                                type: "string",
                                format: "binary"
                            }
                        }
                    }
                }
            }
    }
    */
)

router.delete('/media/remove', mediaController.remove
    /*
    #swagger.tags = ['Media']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: '#/components/schemas/RemoveMediaRequest'
        }
    }
    */
)


export default router;