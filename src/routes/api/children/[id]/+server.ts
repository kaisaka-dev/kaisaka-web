import { ChildrenModel } from "$lib/models/childrenModel.js";
import { parseJoinParams } from "$lib/types/joining.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params, url}) => {
    const id = params.id;
    const joinParams = parseJoinParams(url)
    
    if (!id)
        throw error(400, 'Missing ID');
    
    try{
        let child;
        if (!joinParams.hasParams)
            child = await ChildrenModel.instance.findById(id)
        else {
            switch (joinParams.select) {
                case 'caregivers': 
                    child = await ChildrenModel.instance.findThroughJoin_Caregivers(id)
                    break;
                case 'pending-documents':
                    child = await ChildrenModel.instance.getPendingDocuments(id)
                    break;
                case 'full-profile':
                    child = await ChildrenModel.instance.getJoin(
                        '*, members(*), education_status(*), disability_category(*), social_protection_status(*), pwd_ids(*)',
                        { member_id: id }
                    );
                    break;
                default:
                    throw error(404, 'Select statement not found')       
            }
        }
            
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