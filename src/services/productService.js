import axios from "axios";

const API_URL = 'http://192.168.110.35:3000/products';

// const productService = {    
//     /**
//     * Lấy tất cả sản phẩm
//     * @returns {Promise<Array>} Danh sách sản phẩm
//     */
//     getAllProducts: async () => {
//         try {
//             const response = await axios.get(`${API_BASE_URL}/products`);
//             return response.data;
//         } catch (error) {
//             console.error("Lỗi khi lấy sản phẩm:", error);
//             throw error;
//         }
//     },

//     /**
//     * Lấy chi tiết sản phẩm theo ID
//     * @param {number|string} id - ID sản phẩm
//     * @returns {Promise<Object>} Thông tin sản phẩm và các biến thể
//     */
//     getProductById: async (id) => {
//         try {
//             const [productRes, variantsRes] = await Promise.all([
//                 axios.get(`${API_BASE_URL}/products/${id}`),
//                 axios.get(`${API_BASE_URL}/detailProduct?ID_Product=${id}`)
//             ]);

//             return {
//                 ...productRes.data,
//                 variantsRes: variantsRes.data
//             };

//         } catch (error) {
//             console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
//             throw error;
//         }
//     },

//     /**
//    * Lấy các biến thể của sản phẩm
//    * @param {number|string} productId - ID sản phẩm
//    * @returns {Promise<Array>} Danh sách biến thể
//    */
//   getVariantsByProductId: async (productId) => {
//     try {
//         const response = await axios.get(`${API_BASE_URL}/detailPrduct?ID_Product=${productId}`);
//         return response.data;
//     } catch (error) {
//         console.error("Lỗi khi lấy biến thể sản phẩm:", error);
//         throw error;
//     }
//   }

// };

// export default productService;

/*
// Ưu điểm từng phiên bản
// Phiên bản 1 (OOP Style)
// ✅ Tích hợp nhiều API liên quan vào một service
// ✅ Tối ưu request bằng Promise.all (trong getProductById)
// ✅ Dễ mở rộng khi thêm các phương thức mới
// ✅ Code gọn gàng khi có nhiều API cần gọi cùng lúc

// 📌 Phù hợp khi:

// Cần lấy cả thông tin sản phẩm + biến thể

// Muốn đóng gói logic API vào một service duy nhất

// Phiên bản 2 (Functional Style)
// ✅ Đơn giản, dễ hiểu
// ✅ Phù hợp Redux Toolkit (vì RTK thường dùng hàm độc lập)
// ✅ Linh hoạt khi chỉ cần một vài API

// 📌 Phù hợp khi:

// Chỉ cần các API cơ bản

// Dùng với Redux Toolkit hoặc React Context */

// export const getProducts = async () => {
//     try {
//         const response = await axios.get(`${API_BASE_URL}/products`);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching products:', error);
//         throw error;
//     }
// };

// export const getProductById = async (id) => {
//     try {
//         const response = await axios.get(`${API_BASE_URL}/products/${id}`);
//         return response.data;
//     }catch(error) {
//         console.error(`Error fetching product ${id}:`, error);
//         throw error;
//     }
// }


// For classic Redux
export const fetchProducts = async () => {
    const response = await axios.get(API_URL);
    console.log("Products fetched successfully:", response.data);
    return response.data;
};

export const fetchProductById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    console.log(`Product with ID ${id} fetched successfully:`, response.data);
    return response.data;
}

// For Redux Toolkit (createAsyncThunk)
export const fetchProductsRTK = axios.get(API_URL).then(res => res.data);
export const fetchProductByIdRTK = (id) => axios.get(`${API_URL}/${id}`).then(res => res.data);