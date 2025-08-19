import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import CompetancyModel ,{ competencyDAO } from "../models/competency.model"
import response from "../utils/response";
import { isValidObjectId } from "mongoose";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            await competencyDAO.validate(req.body)
            const result = await CompetancyModel.create(req.body)
            response.success(res, result, "Success create Competancy")
        } catch (error) {
            response.error(res, error, "Failed create Competancy")
        }
    },
    async findAll(req: IReqUser, res: Response) {
        const { page = 1, limit = 9999, search, main_competency } = req.query as unknown as IPaginationQuery;
        try {
            const query: any = {};
            
            // filter search
            if (search) {
                Object.assign(query, {
                    $or: [
                        { title: { $regex: search, $options: "i" } },
                        { description: { $regex: search, $options: "i" } },
                    ],
                });
            }

            // filter main_competency
            if (main_competency) {
                query.main_competency = main_competency;
            }

            const result = await CompetancyModel.find(query)
                .limit(Number(limit))
                .skip((Number(page) - 1) * Number(limit))
                .sort({ createdAt: -1 })
                .exec();

            const count = await CompetancyModel.countDocuments(query);

            response.pagination(
                res,
                result,
                {
                    total: count,
                    totalPages: Math.ceil(count / Number(limit)),
                    current: Number(page),
                },
                "Success find all Competancy"
            );
        } catch (error) {
            response.error(res, error, "Failed find all Competancy");
        }
    },
    async findOne(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "failed find one a Competancy");
            }
            
            const result = await CompetancyModel.findById(id)
            response.success(res, result, "Success find a Competancy")
        } catch (error) {
            response.error(res, error, "Failed find a Competancy")
        }
    },
    async update(req: IReqUser, res: Response) {
        try {
            try {
                const { id } = req.params
                
                if (!isValidObjectId(id)) {
                    return response.notFound(res, "failed find one a Competancy");
                }
                
                const result = await CompetancyModel.findByIdAndUpdate(id, req.body, {
                    new: true
                })
                response.success(res, result, "Success update Competancy")
            } catch (error) {
                response.error(res, error, "Failed update Competancy")
            }
        } catch (error) {
            response.error(res, error, "Failed update Competancy")
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "Failed find one a Competancy");
            }
            
                const result = await CompetancyModel.findByIdAndDelete(id, {new: true})
                response.success(res, result, "Success remove Competancy")
        } catch (error) {
            response.error(res, error, "Failed remove Competancy")
        }
    },
    async findByMainCompetency(req: IReqUser, res: Response) {
        try {
            const { main_competency } = req.params;
            const { search, limit = 999, page = 1, access } = req.query;

            // Inisialisasi filter dasar
            const filter: any = { main_competency };

            // Filter access berdasarkan user login
            if (access) {
                filter.access = { $in: [access, "all-team"] };
            }

            // Tambahkan filter pencarian jika ada
            if (search) {
                filter.$or = [
                    { title: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } },
                ];
            }

            // Pagination
            const limitNumber = parseInt(limit as string, 10);
            const pageNumber = parseInt(page as string, 10);
            const skip = (pageNumber - 1) * limitNumber;

            // Query data dan jumlah total
            const result = await CompetancyModel.find(filter)
                .skip(skip)
                .limit(limitNumber);

            const total = await CompetancyModel.countDocuments(filter);

            // Jika tidak ditemukan
            if (!result || result.length === 0) {
                return response.notFound(res, "No competency found with the given main competency and access");
            }

            // Respon data dengan pagination
            response.pagination(res, result, {
                total,
                totalPages: Math.ceil(total / limitNumber),
                current: pageNumber,
            }, "Success find all by main competency");

        } catch (error) {
            response.error(res, error, "Failed to find all by main competency");
        }
    },
    async findOneBySlug(req: IReqUser, res: Response) {
        try {
            const { slug } = req.params;
            const result = await CompetancyModel.findOne({
                slug,
            });
        
            if (!result) return response.notFound(res, "Competancy not found");
        
            response.success(res, result, "Success find one by slug an Competancy");
        } catch (error) {
            response.error(res, error, "Failed find one by slug an Competancy");
        }
    },
}