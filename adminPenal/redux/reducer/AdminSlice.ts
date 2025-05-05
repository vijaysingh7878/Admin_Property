const { createSlice } = require("@reduxjs/toolkit");

export const AdminSlice = createSlice({
    name: 'admin',
    initialState: {
        data: null
    },
    reducers: {
        login(state, data) {
            state.data = data.payload.admin
            localStorage.setItem('admin', JSON.stringify(data.payload.admin));
            if (data.payload.adminToken) {
                localStorage.setItem('adminToken', data.payload.adminToken)
            }
        },
        logout(state) {
            state.data = null;
            localStorage.removeItem('admin')
            localStorage.removeItem('adminToken')
        }
    }
})
export const { login, logout } = AdminSlice.actions;
export default AdminSlice.reducer