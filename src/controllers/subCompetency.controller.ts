import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import { isValidObjectId } from "mongoose";
import SubCompetencyModel, { subCompetencyDAO } from "../models/subCompetency.model";
import { isReadonlyKeywordOrPlusOrMinusToken } from "typescript";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            await subCompetencyDAO.validate(req.body)
            const result = await SubCompetencyModel.create(req.body)
            response.success(res, result, "Success create SubCompetency")
        } catch (error) {
            response.error(res, error, "Failed create SubCompetency")
        }
    },
    async findAll(req: IReqUser, res: Response) {
        const { page = 1, limit = 10, search } = req.query as unknown as IPaginationQuery
        try {
            const query = {}
            
            if(search) {
                Object.assign(query, {
                    $or: [
                        {
                            title: { $regex: search, $options: 'i' },
                        },
                        {
                            description: { $regex: search, $options: 'i' },
                        }
                    ],
                })
            }

            const result = await SubCompetencyModel.find(query).limit(limit).skip((page - 1) * limit).sort({createdAt: -1}).exec()
            const count =  await SubCompetencyModel.countDocuments(query)

            response.pagination(res, result, {
                total: count,
                totalPages: Math.ceil(count / limit),
                current: page,
            }, "Success find all SubCompetency")
        } catch (error) {
            response.error(res, error, "Failed find all SubCompetency")
        }
    },
    async findOne(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "failed find one a SubCompetency");
            }
            
            const result = await SubCompetencyModel.findById(id)
            response.success(res, result, "Success find a SubCompetency")
        } catch (error) {
            response.error(res, error, "Failed find a SubCompetency")
        }
    },
    async update(req: IReqUser, res: Response) {
        try {
            try {
                const { id } = req.params
                
                if (!isValidObjectId(id)) {
                    return response.notFound(res, "failed find one a SubCompetency");
                }
                
                const result = await SubCompetencyModel.findByIdAndUpdate(id, req.body, {
                    new: true
                })
                response.success(res, result, "Success update SubCompetency")
            } catch (error) {
                response.error(res, error, "Failed update SubCompetency")
            }
        } catch (error) {
            response.error(res, error, "Failed update SubCompetency")
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "Failed find one a SubCompetency");
            }
            
                const result = await SubCompetencyModel.findByIdAndDelete(id, {new: true})
                response.success(res, result, "Success remove SubCompetency")
        } catch (error) {
            response.error(res, error, "Failed remove SubCompetency")
        }
    },

    async findOneBySlug(req: IReqUser, res: Response) {
        try {
            const { slug } = req.params;
            const result = await SubCompetencyModel.findOne({
                slug,
            });
    
            if (!result) return response.notFound(res, "SubCompetency not found");
    
            response.success(res, result, "Success find one by slug an SubCompetency");
        } catch (error) {
            response.error(res, error, "Failed find one by slug an SubCompetency");
        }
    },

    // async findByMainCompetency(req: IReqUser, res: Response) {
    //     try {
    //         const { mainCompetency } = req.params;

    //         const result = await SubCompetencyModel.find({ main_competency: mainCompetency }).exec();
    //         response.success(res, result, `Success find all subCompetency with ${mainCompetency} competency`);
    //     } catch (error) {
    //         response.error(res, error, "Failed to find subCompetency by main competency");
    //     }
    // },

    async findAllByCompetency(req: IReqUser, res: Response) {
        try {
            const { competencyId } = req.params;
            const { search, limit = "10", page = "1" } = req.query;

            // Validasi competencyId
            if (!isValidObjectId(competencyId)) {
                return response.error(res, null, "Competency not found");
            }

            // Filter dasar
            const filter: any = { byCompetency: competencyId };

            // Filter pencarian jika search tersedia
            if (search) {
                filter.$or = [
                    { title: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } }
                ];
            }

            // Pagination
            const limitNumber = parseInt(limit as string, 10);
            const pageNumber = parseInt(page as string, 10);
            const skip = (pageNumber - 1) * limitNumber;

            // Query data dan total
            const result = await SubCompetencyModel.find(filter)
                .skip(skip)
                .limit(limitNumber);

            const count = await SubCompetencyModel.countDocuments(filter);

            // Respon data dengan pagination
            response.pagination(res, result, {
                total: count,
                totalPages: Math.ceil(count / limitNumber),
                current: pageNumber,
            }, "Success find all SubCompetency");
        } catch (error) {
            response.error(res, error, "Failed to find all subCompetency by competency");
        }
    }
}