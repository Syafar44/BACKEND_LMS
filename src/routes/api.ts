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
import resumeController from '../controllers/resume.controller';
import saveController from '../controllers/save.controller';
import completedController from '../controllers/completed.controller';
import lkpController from '../controllers/lkp.controller';
import notificationController from '../controllers/notification.controller';
import lkpSunnahController from '../controllers/lkpSunnah.controller';
import certificateController from '../controllers/certificate.controller';
import sopIkController from '../controllers/sopIk.controller';
import kuisSopIkController from '../controllers/kuisSopIk.controller';
import scoreSopIkController from '../controllers/scoreSopIk.controller';
import scoreSopController from '../controllers/scoreSop.controller';
import scoreIkController from '../controllers/scoreIk.controller';
import kuisIkController from '../controllers/kuisIk.controller';
import kuisSopController from '../controllers/kuisSop.controller';
import ikController from '../controllers/ik.controller';
import sopController from '../controllers/sop.controller';
import kuisKajianController from '../controllers/kuisKajian.controller';
import scoreKajianController from '../controllers/scoreKajian.controller';
import asesmenController from '../controllers/asesmen.controller';
import kuisAsesmenController from '../controllers/kuisAsesmen.controller';
import partAsesmenController from '../controllers/partAsesmen.controller';
import retAsesmenController from '../controllers/retAsesmen.controller';

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
    router.get('/auth/user', authMiddleware, aclMiddleware([ROLES.ADMIN]), authController.findAll

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
router.put('/auth/user/:id', authMiddleware, aclMiddleware([ROLES.ADMIN]), authController.updateUser
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
router.put('/auth/password/:id', authMiddleware, aclMiddleware([ROLES.ADMIN]) ,authController.adminUpdatePassword
    /**
        #swagger.tags = ['Auth']
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.requestBody = {
            required: true, 
            schema: {$ref: "#/components/schemas/UpdatePasswordAdminRequest"}
        }
    */
);
router.put('/auth/role/:id', authMiddleware, aclMiddleware([ROLES.ADMIN]) ,authController.updateRole
    /**
        #swagger.tags = ['Auth']
        #swagger.security = [{ "bearerAuth": [] }]
    */
);
router.put('/auth/image', authMiddleware ,authController.updateImage
    /**
        #swagger.tags = ['Auth']
        #swagger.security = [{ "bearerAuth": [] }]
    */
);
router.delete('/auth/user/:id', authMiddleware, aclMiddleware([ROLES.ADMIN]), authController.deleteUser
    /**
        #swagger.tags = ['Auth']
        #swagger.security = [{
            "bearerAuth": []
        }]
    */
)
router.post(
  '/auth/register/bulk',
  authMiddleware, aclMiddleware([ROLES.ADMIN]),
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

/// ASESMEN
router.post('/asesmen', authMiddleware , asesmenController.create
    /*
    #swagger.tags = ['ASESMEN']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateAsesmenRequest"
        }
    }
    */
)
router.get('/asesmen', asesmenController.findAll
    /*
    #swagger.tags = ['ASESMEN']
    */
)
router.get('/asesmen/:id', asesmenController.findOne
    /*
    #swagger.tags = ['ASESMEN']
    */
)
router.put('/asesmen/:id', asesmenController.update
    /*
    #swagger.tags = ['ASESMEN']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateAsesmenRequest"
        }
    }
    */
)
router.delete('/asesmen/:id', asesmenController.remove
    /*
    #swagger.tags = ['ASESMEN']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)

/// KUIS ASESMEN
router.post('/kuisasesmen', authMiddleware , kuisAsesmenController.create
    /*
    #swagger.tags = ['KUIS ASESMEN']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateKuisAsesmenRequest"
        }
    }
    */
)
router.get('/kuisasesmen', kuisAsesmenController.findAll
    /*
    #swagger.tags = ['KUIS ASESMEN']
    */
)
router.get('/kuisasesmen/:id', kuisAsesmenController.findOne
    /*
    #swagger.tags = ['KUIS ASESMEN']
    */
)
router.put('/kuisasesmen/:id', kuisAsesmenController.update
    /*
    #swagger.tags = ['KUIS ASESMEN']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateKuisAsesmenRequest"
        }
    }
    */
)
router.delete('/kuisasesmen/:id', kuisAsesmenController.remove
    /*
    #swagger.tags = ['KUIS ASESMEN']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/kuisasesmen/:asesmen/asesmen', kuisAsesmenController.findAllByAsesmen
    /*
    #swagger.tags = ['KUIS ASESMEN']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)

/// PARTISIPAN ASESMEN
router.post('/partasesmen', authMiddleware , partAsesmenController.create
    /*
    #swagger.tags = ['PART ASESMEN']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreatePartAsesmenRequest"
        }
    }
    */
)
router.get('/partasesmen', partAsesmenController.findAll
    /*
    #swagger.tags = ['PART ASESMEN']
    */
)
router.get('/partasesmen/:id', partAsesmenController.findOne
    /*
    #swagger.tags = ['PART ASESMEN']
    */
)
router.put('/partasesmen/:id', partAsesmenController.update
    /*
    #swagger.tags = ['PART ASESMEN']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreatePartAsesmenRequest"
        }
    }
    */
)
router.delete('/partasesmen/:id', partAsesmenController.remove
    /*
    #swagger.tags = ['PART ASESMEN']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/partasesmen/:protector_id/protector_id', partAsesmenController.findOneByProtId
    /*
    #swagger.tags = ['PART ASESMEN']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)

/// RETURN ASESMEN
router.post('/retasesmen' , retAsesmenController.create
    /*
    #swagger.tags = ['RET ASESMEN']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateRetAsesmenRequest"
        }
    }
    */
)
router.get('/retasesmen', retAsesmenController.findAll
    /*
    #swagger.tags = ['RET ASESMEN']
    */
)
router.get('/retasesmen/:id', retAsesmenController.findOne
    /*
    #swagger.tags = ['RET ASESMEN']
    */
)
router.delete('/retasesmen/:id', retAsesmenController.remove
    /*
    #swagger.tags = ['RET ASESMEN']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.delete('/retasesmen/:createdBy/createdBy', retAsesmenController.findAllByUserId
    /*
    #swagger.tags = ['RET ASESMEN']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)

/// SCORE KAJIAN
router.post('/scorekajian', authMiddleware , scoreKajianController.create
    /*
    #swagger.tags = ['SCORE KAJIAN']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateScoreKajianRequest"
        }
    }
    */
)
router.get('/scorekajian', scoreKajianController.findAll
    /*
    #swagger.tags = ['SCORE KAJIAN']
    */
)
router.get('/scorekajian/:id', scoreKajianController.findOne
    /*
    #swagger.tags = ['SCORE KAJIAN']
    */
)
router.delete('/scorekajian/:id', scoreKajianController.remove
    /*
    #swagger.tags = ['SCORE KAJIAN']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/scorekajian/:kajian/kajian', authMiddleware,  scoreKajianController.findAllByKajian
    /*
    #swagger.tags = ['SCORE KAJIAN']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/scorekajian-user', authMiddleware,  scoreKajianController.findAllByUser
    /*
    #swagger.tags = ['SCORE KAJIAN']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/scorekajian-export', scoreKajianController.exportScore
    /*
    #swagger.tags = ['SCORE KAJIAN']
    */
)

/// KUIS KAJIAN
router.post('/kuiskajian', kuisKajianController.create
    /*
    #swagger.tags = ['KUIS KAJIAN']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateKuisKajianRequest"
        }
    }
    */
)
router.get('/kuiskajian', kuisKajianController.findAll
    /*
    #swagger.tags = ['KUIS KAJIAN']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/kuiskajian/:id', kuisKajianController.findOne
    /*
    #swagger.tags = ['KUIS KAJIAN']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.put('/kuiskajian/:id', kuisKajianController.update
    /*
    #swagger.tags = ['KUIS KAJIAN']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateKuisSopIkRequest"
        }
    }
    */
)
router.delete('/kuiskajian/:id', kuisKajianController.remove
    /*
    #swagger.tags = ['KUIS KAJIAN']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/kuiskajian/:kajian/kajian', kuisKajianController.findAllByKajian
    /*
    #swagger.tags = ['KUIS KAJIAN']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)

/// SCORE SOP & IK
router.post('/scoresopik', authMiddleware , scoreSopIkController.create
    /*
    #swagger.tags = ['Score SOP & IK']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateScoreSopIkRequest"
        }
    }
    */
)
router.get('/scoresopik', scoreSopIkController.findAll
    /*
    #swagger.tags = ['Score SOP & IK']
    */
)
router.get('/scoresopik/:id', scoreSopIkController.findOne
    /*
    #swagger.tags = ['Score SOP & IK']
    */
)
router.delete('/scoresopik/:id', scoreSopIkController.remove
    /*
    #swagger.tags = ['Score SOP & IK']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/scoresopik/:sopIk/sopIk', authMiddleware,  scoreSopIkController.findAllBySopIk
    /*
    #swagger.tags = ['Score SOP & IK']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/scoresopik-user', authMiddleware,  scoreSopIkController.findAllByUser
    /*
    #swagger.tags = ['Score SOP & IK']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/scoresopik-export', scoreSopIkController.exportScore
    /*
    #swagger.tags = ['Score SOP & IK']
    */
)

/// SCORE SOP
router.post('/scoresop', authMiddleware , scoreSopController.create
    /*
    #swagger.tags = ['Score SOP']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateScoreSopIkRequest"
        }
    }
    */
)
router.get('/scoresop', scoreSopController.findAll
    /*
    #swagger.tags = ['Score SOP']
    */
)
router.get('/scoresop/:id', scoreSopController.findOne
    /*
    #swagger.tags = ['Score SOP']
    */
)
router.delete('/scoresop/:id', scoreSopController.remove
    /*
    #swagger.tags = ['Score SOP']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/scoresop/:sop/sop', authMiddleware,  scoreSopController.findAllBySop
    /*
    #swagger.tags = ['Score SOP']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/scoresop-user', authMiddleware,  scoreSopController.findAllByUser
    /*
    #swagger.tags = ['Score SOP']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/scoresop-export', scoreSopController.exportScore
    /*
    #swagger.tags = ['Score SOP']
    */
)

/// SCORE IK
router.post('/scoreik', authMiddleware , scoreIkController.create
    /*
    #swagger.tags = ['Score IK']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateScoreSopIkRequest"
        }
    }
    */
)
router.get('/scoreik', scoreIkController.findAll
    /*
    #swagger.tags = ['Score IK']
    */
)
router.get('/scoreik/:id', scoreIkController.findOne
    /*
    #swagger.tags = ['Score IK']
    */
)
router.delete('/scoreik/:id', scoreIkController.remove
    /*
    #swagger.tags = ['Score IK']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/scoreik/:ik/ik', authMiddleware,  scoreIkController.findAllByIk
    /*
    #swagger.tags = ['Score IK']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/scoreik-user', authMiddleware,  scoreIkController.findAllByUser
    /*
    #swagger.tags = ['Score IK']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/scoreik-export', scoreIkController.exportScore
    /*
    #swagger.tags = ['Score IK']
    */
)

/// KUIS SOP & IK
router.post('/kuissopik', kuisSopIkController.create
    /*
    #swagger.tags = ['KUIS SOP & IK']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateKuisSopIkRequest"
        }
    }
    */
)
router.get('/kuissopik', kuisSopIkController.findAll
    /*
    #swagger.tags = ['KUIS SOP & IK']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/kuissopik/:id', kuisSopIkController.findOne
    /*
    #swagger.tags = ['KUIS SOP & IK']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.put('/kuissopik/:id', kuisSopIkController.update
    /*
    #swagger.tags = ['KUIS SOP & IK']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateKuisSopIkRequest"
        }
    }
    */
)
router.delete('/kuissopik/:id', kuisSopIkController.remove
    /*
    #swagger.tags = ['KUIS SOP & IK']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/kuissopik/:sopIkId/sopIkId', kuisSopIkController.findAllBySopIk
    /*
    #swagger.tags = ['KUIS SOP & IK']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)

/// KUIS SOP
router.post('/kuissop', kuisSopController.create
    /*
    #swagger.tags = ['KUIS SOP']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateKuisSopIkRequest"
        }
    }
    */
)
router.get('/kuissop', kuisSopController.findAll
    /*
    #swagger.tags = ['KUIS SOP']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/kuissop/:id', kuisSopController.findOne
    /*
    #swagger.tags = ['KUIS SOP']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.put('/kuissop/:id', kuisSopController.update
    /*
    #swagger.tags = ['KUIS SOP']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateKuisSopIkRequest"
        }
    }
    */
)
router.delete('/kuissop/:id', kuisSopController.remove
    /*
    #swagger.tags = ['KUIS SOP']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/kuissop/:sop/sop', kuisSopController.findAllBySop
    /*
    #swagger.tags = ['KUIS SOP']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)

/// KUIS IK
router.post('/kuisik', kuisIkController.create
    /*
    #swagger.tags = ['KUIS IK']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateKuisSopIkRequest"
        }
    }
    */
)
router.get('/kuisik', kuisIkController.findAll
    /*
    #swagger.tags = ['KUIS IK']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/kuisik/:id', kuisIkController.findOne
    /*
    #swagger.tags = ['KUIS IK']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.put('/kuisik/:id', kuisIkController.update
    /*
    #swagger.tags = ['KUIS IK']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateKuisSopIkRequest"
        }
    }
    */
)
router.delete('/kuisik/:id', kuisIkController.remove
    /*
    #swagger.tags = ['KUIS IK']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/kuisik/:ik/ik', kuisIkController.findAllByIk
    /*
    #swagger.tags = ['KUIS IK']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)

/// SOP & IK
router.post('/sopik', sopIkController.create
    /*
    #swagger.tags = ['SOP & IK AFTER UPDATE']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateSopIkRequest"
        }
    }
    */
)
router.get('/sopik', sopIkController.findAll
    /*
    #swagger.tags = ['SOP & IK AFTER UPDATE']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/sopik/:id', sopIkController.findOne
    /*
    #swagger.tags = ['SOP & IK AFTER UPDATE']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.put('/sopik/:id', sopIkController.update
    /*
    #swagger.tags = ['SOP & IK AFTER UPDATE']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateSopIkRequest"
        }
    }
    */
)
router.delete('/sopik/:id', sopIkController.remove
    /*
    #swagger.tags = ['SOP & IK AFTER UPDATE']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/sopik/:slug/slug', sopIkController.findOneBySlug
    /*
    #swagger.tags = ['SOP & IK AFTER UPDATE']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)


/// SOP
router.post('/sop', sopController.create
    /*
    #swagger.tags = ['SOP']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateSopRequest"
        }
    }
    */
)
router.get('/sop', sopController.findAll
    /*
    #swagger.tags = ['SOP']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/sop/:id', sopController.findOne
    /*
    #swagger.tags = ['SOP']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.put('/sop/:id', sopController.update
    /*
    #swagger.tags = ['SOP']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateSopRequest"
        }
    }
    */
)
router.delete('/sop/:id', sopController.remove
    /*
    #swagger.tags = ['SOP']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/sop/:slug/slug', sopController.findOneBySlug
    /*
    #swagger.tags = ['SOP']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)

/// IK
router.post('/ik', ikController.create
    /*
    #swagger.tags = ['IK']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateIkRequest"
        }
    }
    */
)
router.get('/ik', ikController.findAll
    /*
    #swagger.tags = ['IK']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/ik/:id', ikController.findOne
    /*
    #swagger.tags = ['IK']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.put('/ik/:id', ikController.update
    /*
    #swagger.tags = ['IK']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateIkRequest"
        }
    }
    */
)
router.delete('/ik/:id', ikController.remove
    /*
    #swagger.tags = ['IK']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/ik/:slug/slug', ikController.findOneBySlug
    /*
    #swagger.tags = ['IK']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)


/// CERTIFICATION
router.post('/certification', authMiddleware, certificateController.create
    /*
    #swagger.tags = ['Certification']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateCertificateRequest"
        }
    }
    */
)
router.get('/certification', certificateController.findAll
    /*
    #swagger.tags = ['Certification']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/certification/:id', certificateController.findOneById
    /*
    #swagger.tags = ['Certification']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.delete('/certification/:id', certificateController.remove
    /*
    #swagger.tags = ['Certification']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/certification-user', authMiddleware, certificateController.findAllByUser
    /*
    #swagger.tags = ['Certification']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)


/// NOTIFICATION
router.post('/notification/token', authMiddleware, notificationController.token
    /*
    #swagger.tags = ['Notification']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateTokenRequest"
        }
    }
    */
)
router.post('/notification/send', notificationController.sendNotif
    /*
    #swagger.tags = ['Notification']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateNotificationRequest"
        }
    }
    */
);

/// LKP
router.post('/lkp/mark', authMiddleware, lkpController.mark
    /*
    #swagger.tags = ['LKP']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateAbsenRequest"
        }
    }
    */
)
router.get('/lkp-user', authMiddleware, lkpController.getLkpByUser
    /*
    #swagger.tags = ['LKP']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/lkp-rekap', authMiddleware, lkpController.getAllHistory
    /*
    #swagger.tags = ['LKP']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)

/// SUNNAH
router.post('/sunnah/mark', authMiddleware, lkpSunnahController.mark
    /*
    #swagger.tags = ['LKP-Sunnah']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateSunnahRequest"
        }
    }
    */
)
router.get('/sunnah-user', authMiddleware, lkpSunnahController.getLkpByUser
    /*
    #swagger.tags = ['LKP-Sunnah']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/sunnah-rekap', authMiddleware, lkpSunnahController.getAllHistory
    /*
    #swagger.tags = ['LKP-Sunnah']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)


/// COMPLETED
router.post('/completed', authMiddleware , completedController.create
    /*
    #swagger.tags = ['Completed']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateCompletedRequest"
        }
    }
    */
)
router.get('/completed-user', authMiddleware , completedController.findAllByUser
    /*
    #swagger.tags = ['Completed']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)

/// KAJIAN
router.post('/kajian', authMiddleware, aclMiddleware([ROLES.ADMIN]), kajianController.create
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
router.put('/kajian/:id', authMiddleware, aclMiddleware([ROLES.ADMIN]), kajianController.update
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
router.delete('/kajian/:id', authMiddleware, aclMiddleware([ROLES.ADMIN]), kajianController.remove
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

/// RESUME
router.post('/resume', authMiddleware, resumeController.create
    /*
    #swagger.tags = ['Resume']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateResumeRequest"
        }
    }
    */
)
router.get('/resume', authMiddleware, resumeController.findAll
    /*
    #swagger.tags = ['Resume']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/resume/:id', resumeController.findOne
    /*
    #swagger.tags = ['Resume']
    */
)
router.delete('/resume/:id', authMiddleware, aclMiddleware([ROLES.ADMIN]), resumeController.remove
    /*
    #swagger.tags = ['Resume']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/resume/:kajian/kajian', authMiddleware, resumeController.findResumeByKajian
    /*
    #swagger.tags = ['Resume']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/resume-user', authMiddleware, resumeController.findAllByUser
    /*
    #swagger.tags = ['Resume']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/resume-export', resumeController.exportResume
    /*
    #swagger.tags = ['Resume']
    */
)

/// SAVE
router.post('/save', authMiddleware, saveController.create
    /*
    #swagger.tags = ['Save']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateSaveRequest"
        }
    }
    */
)
router.get('/save', authMiddleware, saveController.findAll
    /*
    #swagger.tags = ['Save']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/save/:id', saveController.findOne
    /*
    #swagger.tags = ['Save']
    */
)
router.put('/save/:id', authMiddleware, saveController.update
    /*
    #swagger.tags = ['Save']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateSaveRequest"
        }
    }
    */
)
router.delete('/save/:id', saveController.remove
    /*
    #swagger.tags = ['Save']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/save/:competency/competency', authMiddleware, saveController.findAllByCompetency
    /*
    #swagger.tags = ['Save']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/save-user', authMiddleware, saveController.findAllByUser
    /*
    #swagger.tags = ['Save']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)


/// COMPETENCY
router.post('/competency', authMiddleware, aclMiddleware([ROLES.ADMIN]), competencyController.create
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
router.put('/competency/:id', authMiddleware, aclMiddleware([ROLES.ADMIN]), competencyController.update
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
router.delete('/competency/:id', authMiddleware, aclMiddleware([ROLES.ADMIN]), competencyController.remove
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
router.post('/subcompetency', authMiddleware, aclMiddleware([ROLES.ADMIN]), subCompetencyController.create
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
router.put('/subcompetency/:id', authMiddleware, aclMiddleware([ROLES.ADMIN]), subCompetencyController.update

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
router.delete('/subcompetency/:id', authMiddleware, aclMiddleware([ROLES.ADMIN]), subCompetencyController.remove

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
router.post('/kuiscompetency', authMiddleware, aclMiddleware([ROLES.ADMIN]), kuisCompetencyController.create
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
router.put('/kuiscompetency/:id', authMiddleware, aclMiddleware([ROLES.ADMIN]), kuisCompetencyController.update
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
router.delete('/kuiscompetency/:id', authMiddleware, aclMiddleware([ROLES.ADMIN]), kuisCompetencyController.remove
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
router.get('/score-user', authMiddleware,  scoreController.findAllByUser
    /*
    #swagger.tags = ['Score']
    #swagger.security = [{ "bearerAuth": [] }]
    */
)
router.get('/score-export', scoreController.exportScore
    /*
    #swagger.tags = ['Score']
    */
)
router.get('/score-final', scoreController.exportFinalScore
    /*
    #swagger.tags = ['Score']
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

router.post('/media/upload-single', [
    authMiddleware,
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
    authMiddleware,
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

router.delete('/media/remove', [
    authMiddleware, 
], mediaController.remove
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