const mongoose = require('mongoose');
const company = require('./data/company');
const role = require('./data/role');
const permission = require('./data/permission');
const menu_type = require('./data/menu_type');
const menu_item = require('./data/menu_item');
const role_permission = require('./data/role_permission');
const user_role = require('./data/user_role');
const user = require('./data/user');

const Company = require('../models/company');
const Role = require('../models/role');
const Permission = require('../models/permission');
const MenuType = require('../models/menu_type');
const MenuItem = require('../models/menu_item');
const RolePermission = require('../models/role_permission');
const UserRole = require('../models/user_role');
const User = require('../models/user');

const DB_URL = process.env.DB_URL || 'mongodb://127.0.0.1:27017/split-bills';
mongoose.connect(DB_URL);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', () => {
    console.log('Database connected');
})

const seedDB = async () => {
    await Company.deleteMany({});
    await Role.deleteMany({});
    await Permission.deleteMany({});
    await MenuType.deleteMany({});
    await MenuItem.deleteMany({});
    await RolePermission.deleteMany({});
    await UserRole.deleteMany({});
    await User.deleteMany({});

    await Promise.all(company.map( async (element) => {
        const temp = new Company(
            element
        )
        await temp.save();
    }));

    await Promise.all(role.map( async (element) => {
        const temp = new Role(
            element
        )
        await temp.save();
    }));

    await Promise.all(permission.map( async (element) => {
        const temp = new Permission(
            element
        )
        await temp.save();
    }));

    await Promise.all(menu_type.map( async (element) => {
        const temp = new MenuType(
            element
        )
        await temp.save();
    }));

    await Promise.all(menu_item.map( async (element) => {
        const menu_type = await MenuType.findOne({slug:element.type_id});
        const company = await Company.findOne({company_code:element.company_id});

        element.type_id = menu_type._id;
        element.company_id = company._id;

        const temp = new MenuItem(
            element
        )
        await temp.save();
    }));
    
    await Promise.all(role_permission.map( async (element) => {
        const role = await Role.findOne({slug:element.role_id});
        const permission = await Permission.findOne({slug:element.permission_id});

        element.role_id = role._id;
        element.permission_id = permission._id;

        const temp = new RolePermission(
            element
        )

        await temp.save();

        role.permissions.push(permission._id);
        await role.save();
    }));

    await Promise.all(user.map( async (element) => {
        const company = await Company.findOne({company_code:element.company_id});
        const roles = await Role.find({slug: {
            $in : element.roles
        }});

        const new_role = [];
        roles.map(role => {
            new_role.push(role._id);
        })
        element.roles = new_role;
        
        element.company_id = company._id;
        
        const temp = new User(
            element
        )
        await temp.save();
    }));

    await Promise.all(user_role.map( async (element) => {
        const role = await Role.findOne({slug:element.role_id});
        const user = await User.findOne({email:element.user_email});
        
        element.role_id = role._id;
        element.user_id = user._id;

        const temp = new UserRole(
            element
        )
        await temp.save();
    }));
    
}

seedDB().then(() => {
    console.log('DONE SEEDING!');
    // mongoose.connection.close();
})