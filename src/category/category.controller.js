import { response } from "express";
import Category from './category.model.js';
import User from '../users/user.model.js';
import Publication from '../publications/publications.model.js'
const createCategory = async ( nameCategory, descriptionCategory, keeperAdmin, state) => {
    try {

        if (nameCategory === "Noticias") {
                const existCategory = await Category.findOne({ nameCategory: "Noticias" });
                if (existCategory) {
                    console.log("--------------------------- Error ------------------------------------");
                    console.log(`The named category ${nameCategory} already exists. New one cannot be created.`);
                    console.log("----------------------------------------------------------------------");
                    return null;
                };
            };

    const newCategory = new Category({ 
        nameCategory,
        descriptionCategory, 
        state,
        keeperAdmin});
        
        await newCategory.save();
        console.log("Category created successfully:", newCategory);
        return newCategory;
        
    } catch (error) {
        console.error("Error creating category:", error);
        return null;
    }
};

createCategory("Noticias", "Es un apartado para opinar sobre noticias nacionales", "67be37f55f2a8e83afb96fcc", true);

export const addCategory = async (req, res) => {
    try {
        
        const data = req.body;

        const user = await User.findOne({email: data.email});   

        if(!user){
            return res.status(404).json({
                succes: false,
                message: 'User not found',
                error: error.message
            })
        }

        const category = new Category({
            ...data,
            keeperAdmin: user._id,
        });

        await category.save();

        res.status(200).json({
            succes: true,
            category
        });

    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error creating category',
            error: error.message
        })
    }
}

export const categoryView = async (req, res) => {
    const {limite = 10, desde = 0} = req.query;
    const query = {state: true};

    try {
        
        const category = await Category.find(query)
            .populate({path: 'keeperAdmin', match: { status: true }, select: 'email' })
            .skip(Number(desde))
            .limit(Number(limite));

        const total = await Category.countDocuments(query);

        res.status(200).json({
            succes: true,
            total,
            category
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error getting categories',
            error: error.message
        })
    }
} 

export const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const defaultCategory = await Category.findOne({ nameCategory: "Noticias" });

        if (!defaultCategory) {
            return res.status(400).json({
                success: false,
                message: 'The default category "News" does not exist.',
            });
        }
        await Publication.updateMany({ keeperCategory: id }, { keeperCategory: defaultCategory._id });

        await Category.findByIdAndUpdate(id, { state: false });

        res.status(200).json({
            success: true,
            message: 'Category disabled and posts reassigned to default category "News".',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error deleting category',
            error: error.message,
        });
    }
};

export const updateCategory = async (req, res  = response) => {
    try {
        const {id} = req.params;
        const {_id, ...data} = req.body;

        const category = await Category.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({
            succes: true,
            msj: 'Curso actualizado con exito',
            category
        })

    } catch (error) {
        res.status(500).json({
            succes: false,
            msj: "Error al actualizar el curso",
            error: error.message
        })
    }
} 
