const Role = require('../models/role');
const Permission = require('../models/permission');

class Helper {
    constructor() {
        
    }

    async checkPermission(roleId, permName){
        return new Promise((resolve, reject) => {
            const perm = await Permission.findOne({'name': permName});
            const role = await Role.findOne({'_id': roleId});
        })
    }
}