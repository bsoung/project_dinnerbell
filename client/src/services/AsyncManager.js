import superagent from 'superagent';
import _ from 'lodash';

export default {
	getRequest: async (path, params) => {
		const response = await superagent
			.get(path)
			.set('Accept', 'application/json')
			.query(params);

		return response.body;
	},

	postRequest: async (path, params) => {
		const response = await superagent
			.post(path)
			.set('Accept', 'application/json')
			.send(params);

		return response.body;
	}
};