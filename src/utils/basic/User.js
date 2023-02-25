import {UuidGenerate} from "@/utils/basic/UUID";
import validator from "validator/es";

// const defaultToken = "eyJhbGciOiJFUzI1NiJ9.eyJ1aWQiOiI2MDcxOTM3" +
//     "NTcxMTdjNzA4YjBhNjM0NTkiLCJqdGkiOiI2MjMwOWFhZTMwZDFkNjQ4ZW" +
//     "JiYTlhM2MiLCJ1c2VybmFtZSI6Im1laWtlIiwiY2lkIjoid2ViOm5vVG9r" +
//     "ZW4iLCJleHAiOjE2NDc3ODQ0OTR9.ay99JYunPTv1-B1iiunjtW0AyQrOZ" +
//     "NKH3AGdaaICLkkdZ_hf45q4SrZZm47E6kLqZk5HYyhXyeKzjjIk0qWVJA";

const defaultToken = "";

/**
 * 检查LocalStorage是否有token，如果有就返回token，如果没有返回默认值
 * @return {String} token:token值;
 * */
export const getToken = () => {
    let token = localStorage.getItem("jwt");
    if (token) {
        return token;
    } else {
        saveToken(defaultToken);
        return defaultToken;
    }
};

/**
 * 登录成功后保存token到LocalStorage
 * @param {string} token 登录成功后返回的token
 * */
export const saveToken = (token) => {
    localStorage.setItem('jwt', token);
};

/**
 * 检查LocalStorage是否保存有UUID，如果有，使用Validator验证合法性后返回UUID，
 * 如果没有或者合法性校验不通过则调用UUID.UuidGenerate()生成并保存。
 * @returns {string} uuid:从LocalStorage中取得的uuid； newUuid:新生成的uuid。
 * */
export const getUUID = () => {
    const uuid = localStorage.getItem('uuid');
    if (uuid && validator.isUUID(uuid)) {
        return uuid;
    } else {
        const newUuid = UuidGenerate();
        localStorage.setItem('uuid', newUuid);
        return newUuid;
    }
};
