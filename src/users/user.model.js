import {Schema, model} from "mongoose";

const UserSchema = Schema({
    name : {
        type: String,
        required: [true, 'Nombre requerido'],
        maxLength: [25, 'Cant be overcome 25 characters']
    },
    surname : {
        type: String,
        required: [true, 'Apellido requerido'],
        maxLength: [25, 'Cant be overcome 25 characters']
    },
    username : {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: [true, '  Correo requerido'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Contraseña requerida'],
        minLength: 8
    },
    role: {
        type: String,
        required: true,
        enum: ['ADMIN_ROLE', 'NORMAL_ROLE'],
        default: 'NORMAL_ROLE'
    },
    estado: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true,
        versionKey: false,
    }
);

UserSchema.methods.toJSON = function() {
    const {__v, password, _id, ...usuario} = this.toObject();
    usuario.uid = _id;
    return usuario;
}

export default model('User', UserSchema);