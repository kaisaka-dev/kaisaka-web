import { ChildrenModel } from "$lib/models/childrenModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ params }) => {
    
    const id = params.id;

    if(!id){
        throw error(400, 'Missing ID');
    }

    try{
        const child = await ChildrenModel.instance.findById(id);

        if(!child){
            throw error(404, 'Child not found')
        }

        return json(child);
    } catch {
        throw error(500, 'Failed to find child')
    }
};

export const DELETE: RequestHandler = async({ params }) => {
    const id = params.id;

    if(!id){
        throw error(400, 'Missing ID');
    }

    try{
        const result = await ChildrenModel.instance.deleteById(id);

        if(!result){
            throw error(404, 'Child not found')
        }

        return json({ success: true, id });
    } catch {
        throw error(500, 'Failed to delete child')
    }
}