import { FastifyInstance } from "fastify";
import { resolveResource } from "vk-io";

type TParamVk = number | string
type TResponse = Promise<number>
type TFGetGameId = (fastify: FastifyInstance, vk: TParamVk) => TResponse

// Возвращает игровой id в системе. Принимает fastify, vk: ссылка, айди, никнейм. Может кинуть reject с { error_code: number }
const getGameId: TFGetGameId = (fastify, vk) => new Promise(async (resolve, reject) => {

	const { Database, vkUser } = fastify;

	if(Number.isInteger(vk)){

		const user = await Database.findOne('users', 'id', 'id_vk = ?', [vk]);
		return user ? resolve(user.id) : reject({ error_code: 3002 });

	} else if(typeof vk === 'string'){
		
		const screen_name = vk.match(/^(?:https:\/\/|http:\/\/|)(?:vk.com|m.vk.com)(?:\/)([\w|.]{5,32})?(?:\/)?(?:$)/i)?.[1] || vk.match(/^(?:@|)([\w|.]{5,32})?(?:$)/i)?.[1];
		if(!screen_name){
			return reject({ error_code: 500 });
		}
		
		const resource = await resolveResource({
			api: vkUser,
			resource: screen_name
		}).catch(e => {
			reject({ error_code: e?.code === 'RESOURCE_NOT_FOUND' ? 500 : 0 })
		});

		if(resource?.type === 'user'){

			const user = await Database.findOne('users', 'id', 'id_vk = ?', [resource.id]);
			return user ? resolve(user.id) : reject({ error_code: 3002 })

		} else { return reject({ error_code: 500 }); }
		
	} else { return reject({ error_code: 1001 }); }

})

export default getGameId;
