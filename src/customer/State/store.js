import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
//Nếu không có thunk, Redux sẽ báo lỗi vì dispatch chỉ nhận object, không nhận function.
import { thunk } from "redux-thunk";
import authReducer from "./Auth/Reducer";
import { customerProductReducer } from "./Products/Reducer";
import { cartReduce } from "./Cart/Reducer";
import { orderReducer } from "./Order/Reducer";

//Mỗi reducer sẽ phụ trách một phần riêng của state
const rootReducer = combineReducers({
  //Quản lý trạng thái đăng nhập, token, user info
  auth: authReducer,
  //Quản lý danh sách sản phẩm, tìm kiếm, lọc, chi tiết sản phẩm
  products: customerProductReducer,
  //Quản lý giỏ hàng: thêm, xoá, cập nhật sản phẩm
  cart: cartReduce,
  //Order: quản lý đơn hàng: tạo đơn, lịch sử đơn hàng, chi tiết đơn hàng
  order: orderReducer,
});

const store = legacy_createStore(rootReducer, applyMiddleware(thunk));
export default store;