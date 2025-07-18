import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Avatar, Button, Rating, Paper, Chip, IconButton, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { ENDPOINTS, API_BASE } from "../config/api";
import dayjs from "dayjs";
import CloseIcon from '@mui/icons-material/Close';

const CommentSection = ({ productId }) => {
  const [comments, setComments] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [filter, setFilter] = useState(0);
  const [users, setUsers] = useState([]);
  const [deleting, setDeleting] = useState(null);
  const [replying, setReplying] = useState(null); // id comment đang trả lời
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [selectedQuickReply, setSelectedQuickReply] = useState("");
  const [editingAdminReply, setEditingAdminReply] = useState(null); // id comment đang edit admin reply
  const [editReplyText, setEditReplyText] = useState("");
  const [editSelectedQuickReply, setEditSelectedQuickReply] = useState("");

  // Helper functions để lấy token và adminId fresh từ localStorage
  const getAdminToken = () => localStorage.getItem('token') || '';
  const getAdminId = () => localStorage.getItem('adminId') || 'admin';

  // Các câu trả lời nhanh cho admin
  const quickReplies = [
    "Cảm ơn bạn đã đánh giá tốt cho shop! 😊",
    "Cảm ơn ý kiến của bạn, shop sẽ cải thiện hơn nữa!",
    "Rất vui khi bạn hài lòng với sản phẩm của shop! 🎉",
    "Shop xin lỗi vì trải nghiệm chưa tốt, chúng tôi sẽ khắc phục!",
    "Cảm ơn bạn đã tin tưởng và mua hàng tại shop! ❤️",
    "Ý kiến của bạn rất quý giá với chúng tôi!",
    "Shop sẽ cố gắng cải thiện chất lượng sản phẩm!",
    "Cảm ơn bạn đã dành thời gian đánh giá!",
    "Chúc bạn có những trải nghiệm tuyệt vời với sản phẩm! 🌟",
    "Shop rất trân trọng phản hồi của bạn!"
  ];

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(ENDPOINTS.GET_COMMENT_BY_PRODUCT_ID(productId), {
          headers: { "ngrok-skip-browser-warning": "true" },
        });
        const data = res.data || [];
        setComments(data);

        if (data.length > 0) {
          const total = data.length;
          const sum = data.reduce((acc, c) => acc + (c.review_rate || 0), 0);
          setAvgRating((sum / total).toFixed(1));
          setTotalReviews(total);
        } else {
          setAvgRating(0);
          setTotalReviews(0);
        }
      } catch (err) {
        setComments([]);
        setAvgRating(0);
        setTotalReviews(0);
      }
    };
    fetchComments();
  }, [productId]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(ENDPOINTS.GET_ALL_USERS, {
          headers: { "ngrok-skip-browser-warning": "true" },
        });
        setUsers(res.data || []);
      } catch (err) {
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  const getUserFullName = (userId) => {
    const user = users.find((u) => u._id === userId);
    return user?.fullname || "Ẩn danh";
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa bình luận này?')) return;
    
    const adminToken = getAdminToken();
    
    console.log('🗑️ Kiểm tra token khi xóa comment:');
    console.log('📱 Admin Token:', adminToken);
    console.log('🆔 Comment ID:', id);
    
    if (!adminToken) {
      alert('Bạn chưa đăng nhập hoặc thiếu token để xóa bình luận!');
      return;
    }
    
    setDeleting(id);
    try {
      const deleteUrl = ENDPOINTS.DELETE_COMMENT_BY_ID(id);
      
      // Chỉ sử dụng Authorization header chuẩn để tránh lỗi CORS
      const headers = { 
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${adminToken}`
      };
      
      console.log('🌐 DELETE Request Details:');
      console.log('📍 URL:', deleteUrl);
      console.log('📋 Headers:', headers);
      console.log('🔑 Raw Token:', adminToken);
      
      const response = await axios.delete(deleteUrl, { headers });
      
      console.log('✅ Delete Response:', response.data);
      setComments((prev) => prev.filter((c) => c._id !== id));
      console.log('✅ Xóa bình luận thành công!');
      alert('Xóa bình luận thành công!');
    } catch (err) {
      console.error('❌ Lỗi khi xóa bình luận:');
      console.error('📋 Error Details:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        headers: err.response?.headers
      });
      
      let errorMessage = 'Xóa bình luận thất bại!';
      if (err.response?.status === 401) {
        errorMessage = 'Không có quyền xóa! Vui lòng đăng nhập lại.';
      } else if (err.response?.status === 404) {
        errorMessage = 'Bình luận không tìm thấy!';
      } else if (err.response?.status === 500) {
        errorMessage = 'Lỗi server! Vui lòng thử lại sau.';
      }
      
      alert(errorMessage);
    } finally {
      setDeleting(null);
    }
  };

  // Lấy các trả lời admin cho từng comment (giả sử là các comment có review_user_id === ADMIN_ID và review_comment_reply_to === c._id)
  // Nếu API không hỗ trợ, ta sẽ chỉ cho phép trả lời 1 lần, và lưu trả lời admin vào state tạm thời sau khi gửi thành công
  // Ở đây, ta sẽ tìm các comment có review_user_id === ADMIN_ID và review_product_id === productId và review_comment_reply_to === c._id
  // Nếu không có trường reply_to, ta sẽ chỉ cho phép trả lời 1 lần dưới mỗi comment khách hàng

  // API mới trả về admin_reply trực tiếp trong mỗi comment
  // Lọc chỉ lấy comment của khách hàng (không phải admin)
  const customerComments = comments.filter((c) => c.review_user_id !== getAdminId());

  const getAdminReplyFor = (customerComment) => {
    // Lấy admin_reply trực tiếp từ comment object
    const adminReply = customerComment.admin_reply;
    
    // Chỉ return nếu admin reply tồn tại VÀ có content không rỗng
    if (adminReply && adminReply.content && adminReply.content.trim() !== '') {
      return adminReply;
    }
    
    return null;
  };

  const handleReply = (id) => {
    setReplying(id);
    setReplyText("");
    setSelectedQuickReply("");
  };

  const handleQuickReplyChange = (event) => {
    const selectedText = event.target.value;
    setSelectedQuickReply(selectedText);
    if (selectedText) {
      setReplyText(selectedText);
    }
  };

  const handleEditAdminReply = (comment) => {
    setEditingAdminReply(comment._id);
    setEditReplyText(comment.admin_reply.content);
    setEditSelectedQuickReply("");
  };

  const handleEditQuickReplyChange = (event) => {
    const selectedText = event.target.value;
    setEditSelectedQuickReply(selectedText);
    if (selectedText) {
      setEditReplyText(selectedText);
    }
  };

  const handleUpdateAdminReply = async (customerComment) => {
    if (!editReplyText.trim()) return;
    
    const adminToken = getAdminToken();
    const adminId = getAdminId();
    
    console.log('✏️ Kiểm tra token khi cập nhật admin reply:');
    console.log('📱 Admin Token:', adminToken);
    console.log('👤 Admin ID:', adminId);
    
    if (!adminToken) {
      alert('Bạn chưa đăng nhập hoặc thiếu token!');
      return;
    }
    
    setSendingReply(true);
    try {
      const updateUrl = ENDPOINTS.CREATE_ADMIN_REPLY(customerComment._id);
      const payload = {
        admin_reply: {
          content: editReplyText,
          adminId: adminId
        }
      };
      
      console.log('📝 Admin Reply Update Request Details:');
      console.log('📍 URL:', updateUrl);
      console.log('📋 Payload:', payload);
      console.log('🆔 Comment ID:', customerComment._id);

      await axios.patch(updateUrl, payload, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      setEditingAdminReply(null);
      setEditReplyText("");
      setEditSelectedQuickReply("");
      
      console.log('🔄 Reloading comments after admin reply update...');
      // Reload lại comment
      const res = await axios.get(ENDPOINTS.GET_COMMENT_BY_PRODUCT_ID(productId), {
        headers: { "ngrok-skip-browser-warning": "true" },
      });
      
      console.log('📥 Updated comments data:', res.data);
      setComments(res.data || []);
      alert('Cập nhật trả lời thành công!');
    } catch (err) {
      console.error('❌ Lỗi khi cập nhật admin reply:', err);
      alert('Cập nhật trả lời thất bại!');
    } finally {
      setSendingReply(false);
    }
  };

  const handleSendReply = async (customerComment) => {
    if (!replyText.trim()) return;
    
    const adminToken = getAdminToken();
    const adminId = getAdminId();
    
    console.log('🔍 Kiểm tra token khi comment:');
    console.log('📱 Admin Token:', adminToken);
    console.log('👤 Admin ID:', adminId);
    
    if (!adminToken) {
      alert('Bạn chưa đăng nhập hoặc thiếu token!');
      return;
    }
    setSendingReply(true);
    try {
      const replyUrl = ENDPOINTS.CREATE_ADMIN_REPLY(customerComment._id);
      const payload = {
        admin_reply: {
          content: replyText,
          adminId: adminId
        }
      };
      
      console.log('📝 Admin Reply Request Details:');
      console.log('📍 URL:', replyUrl);
      console.log('📋 Payload:', payload);
      console.log('🆔 Comment ID:', customerComment._id);

      await axios.patch(replyUrl, payload, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });
      setReplying(null);
      setReplyText("");
      setSelectedQuickReply("");
      setEditingAdminReply(null);
      setEditReplyText("");
      setEditSelectedQuickReply("");
      
      console.log('🔄 Reloading comments after admin reply...');
      // Reload lại comment
      const res = await axios.get(ENDPOINTS.GET_COMMENT_BY_PRODUCT_ID(productId), {
        headers: { "ngrok-skip-browser-warning": "true" },
      });
      
      console.log('📥 Updated comments data:', res.data);
      setComments(res.data || []);
      alert('Trả lời thành công!');
    } catch (err) {
      alert('Gửi trả lời thất bại!');
    } finally {
      setSendingReply(false);
    }
  };

  const filteredComments = filter
    ? customerComments.filter((c) => c.review_rate === filter)
    : customerComments;

  const renderStarFilters = () => (
    <Box sx={{ display: "flex", gap: 2, mb: 2, justifyContent: "center" }}>
      <Button variant={filter === 0 ? "contained" : "outlined"} onClick={() => setFilter(0)}>Tất cả</Button>
      {[5, 4, 3, 2, 1].map((star) => (
        <Button
          key={star}
          variant={filter === star ? "contained" : "outlined"}
          onClick={() => setFilter(star)}
        >
          {star} SAO
        </Button>
      ))}
    </Box>
  );

  return (
    <Box sx={{ width: "100%", maxWidth: 900, mx: "auto", mt: 2, bgcolor: "#f8fbff", borderRadius: 4, p: 3, boxShadow: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, textAlign: "center", color: "#1976d2" }}>
        Đánh giá sản phẩm
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, justifyContent: "center" }}>
        <Typography variant="h6" sx={{ color: "#388e3c", fontWeight: 700 }}>{avgRating} trên 5 sao</Typography>
        <Rating value={Number(avgRating)} precision={0.1} readOnly />
        <Typography variant="body2" color="text.secondary">
          ({totalReviews} Reviews)
        </Typography>
      </Box>
      {renderStarFilters()}
      <Box sx={{ color: "#888", fontWeight: 600, mb: 2, textAlign: "center" }}>per...</Box>
      {filteredComments.length === 0 && (
        <Typography textAlign="center">Chưa có đánh giá nào.</Typography>
      )}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {filteredComments.map((c, idx) => {
          const adminReply = getAdminReplyFor(c);
          
          // Debug admin reply data
          console.log('🔍 Comment Debug:', {
            commentId: c._id,
            rawAdminReply: c.admin_reply,
            hasValidAdminReply: !!adminReply,
            adminReplyContent: adminReply?.content || 'No content',
            showReplyButton: !adminReply
          });
          
          return (
            <Paper
              key={c._id || idx}
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                maxWidth: 800,
                mx: "auto",
                mb: 3,
                background: "#fff",
                boxShadow: "0 2px 12px 0 #e3f2fd",
                transition: "box-shadow 0.2s",
                position: 'relative',
                '&:hover': { boxShadow: "0 4px 24px 0 #90caf9" }
              }}
            >
              {/* Nút delete nhỏ góc phải */}
              <IconButton
                size="small"
                aria-label="delete"
                onClick={() => handleDelete(c._id)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  color: '#aaa',
                  background: 'rgba(0,0,0,0.03)',
                  '&:hover': { color: '#fff', background: '#e53935' },
                  zIndex: 2,
                }}
                disabled={deleting === c._id}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
              {/* Dòng thông tin user, ngày, màu/size, số sao */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                <Avatar sx={{ bgcolor: "#1976d2", color: "#fff", fontWeight: 700 }}>
                  {getUserFullName(c.review_user_id)?.[0] || (idx + 1).toString()}
                </Avatar>
                <Typography sx={{ fontWeight: 700, mr: 1, color: "#1976d2" }}>
                  {getUserFullName(c.review_user_id)}
                </Typography>
                <Rating value={c.review_rate} readOnly size="small" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                  {dayjs(c.createdAt).format("DD-MM-YYYY")}
                </Typography>
                {c.variant_color && (
                  <Chip label={`Màu: ${c.variant_color}`} size="small" sx={{ bgcolor: "#e3f2fd", color: "#1976d2", fontWeight: 600, mr: 1 }} />
                )}
                {c.variant_size && (
                  <Chip label={`Size: ${c.variant_size}`} size="small" sx={{ bgcolor: "#fffde7", color: "#fbc02d", fontWeight: 600 }} />
                )}
              </Box>
              {/* Nội dung đánh giá */}
              <Typography sx={{ mb: 1, fontSize: 16, color: "#333" }}>{c.review_comment}</Typography>
              {/* Ảnh review nằm ngang */}
              {c.review_image && c.review_image.length > 0 && (
                <Box sx={{ display: "flex", gap: 2, mt: 1, flexWrap: "wrap" }}>
                  {c.review_image.map((img, i) => (
                    <img
                      key={i}
                      src={img.startsWith("http") ? img : `${API_BASE}${img}`}
                      alt="review"
                      style={{
                        width: 90,
                        height: 110,
                        objectFit: "cover",
                        borderRadius: 8,
                        border: "1px solid #eee",
                        boxShadow: "0 2px 8px #e3f2fd",
                        marginRight: 8,
                      }}
                    />
                  ))}
                </Box>
              )}
              {/* Nút trả lời và form trả lời admin */}
              {!adminReply && (
                replying === c._id ? (
                  <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Dropdown câu trả lời nhanh */}
                    <FormControl size="small" sx={{ width: '100%' }}>
                      <InputLabel>Chọn câu trả lời nhanh (tùy chọn)</InputLabel>
                      <Select
                        value={selectedQuickReply}
                        onChange={handleQuickReplyChange}
                        label="Chọn câu trả lời nhanh (tùy chọn)"
                        sx={{ fontSize: 14 }}
                      >
                        <MenuItem value="">
                          <em>Nhập trả lời tùy chỉnh</em>
                        </MenuItem>
                        {quickReplies.map((reply, index) => (
                          <MenuItem key={index} value={reply} sx={{ fontSize: 13, whiteSpace: 'pre-wrap' }}>
                            {reply}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    
                    {/* Textarea nhập nội dung */}
                    <TextField
                      multiline
                      minRows={2}
                      maxRows={5}
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Nhập nội dung trả lời hoặc chọn từ dropdown bên trên..."
                      size="small"
                      sx={{ width: '100%' }}
                    />
                    
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleSendReply(c)}
                        disabled={sendingReply || !replyText.trim()}
                      >
                        Gửi trả lời
                      </Button>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => {
                          setReplying(null);
                          setSelectedQuickReply("");
                        }}
                        disabled={sendingReply}
                      >
                        Hủy
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mt: 2, fontWeight: 600, color: '#1976d2', borderColor: '#1976d2' }}
                    onClick={() => handleReply(c._id)}
                  >
                    Trả lời
                  </Button>
                )
              )}
              {/* Hiển thị trả lời admin nếu có */}
              {adminReply && (
                <Box sx={{ mt: 2, ml: 4, p: 2, bgcolor: '#f1f8e9', borderRadius: 2, borderLeft: '4px solid #388e3c' }}>
                  {editingAdminReply === c._id ? (
                    // Form chỉnh sửa admin reply
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Typography sx={{ fontWeight: 700, color: '#388e3c', mb: 1 }}>Chỉnh sửa trả lời admin:</Typography>
                      
                      {/* Dropdown câu trả lời nhanh cho edit */}
                      <FormControl size="small" sx={{ width: '100%' }}>
                        <InputLabel>Chọn câu trả lời nhanh (tùy chọn)</InputLabel>
                        <Select
                          value={editSelectedQuickReply}
                          onChange={handleEditQuickReplyChange}
                          label="Chọn câu trả lời nhanh (tùy chọn)"
                          sx={{ fontSize: 14 }}
                        >
                          <MenuItem value="">
                            <em>Nhập trả lời tùy chỉnh</em>
                          </MenuItem>
                          {quickReplies.map((reply, index) => (
                            <MenuItem key={index} value={reply} sx={{ fontSize: 13, whiteSpace: 'pre-wrap' }}>
                              {reply}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      
                      {/* Textarea chỉnh sửa nội dung */}
                      <TextField
                        multiline
                        minRows={2}
                        maxRows={5}
                        value={editReplyText}
                        onChange={e => setEditReplyText(e.target.value)}
                        placeholder="Chỉnh sửa nội dung trả lời..."
                        size="small"
                        sx={{ width: '100%' }}
                      />
                      
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleUpdateAdminReply(c)}
                          disabled={sendingReply || !editReplyText.trim()}
                          sx={{ bgcolor: '#388e3c', '&:hover': { bgcolor: '#2e7d32' } }}
                        >
                          Cập nhật
                        </Button>
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => {
                            setEditingAdminReply(null);
                            setEditReplyText("");
                            setEditSelectedQuickReply("");
                          }}
                          disabled={sendingReply}
                        >
                          Hủy
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    // Hiển thị admin reply bình thường
                    <>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography sx={{ fontWeight: 700, color: '#388e3c' }}>Admin trả lời:</Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          {dayjs(adminReply.createdAt).format("DD-MM-YYYY HH:mm")}
                        </Typography>
                      </Box>
                      <Typography sx={{ color: '#333', fontSize: 15, mb: 2 }}>{adminReply.content}</Typography>
                      
                      {/* Nút chỉnh sửa admin reply */}
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => handleEditAdminReply(c)}
                          sx={{ 
                            color: '#388e3c', 
                            fontWeight: 600,
                            '&:hover': { bgcolor: 'rgba(56, 142, 60, 0.1)' }
                          }}
                        >
                          Chỉnh sửa
                        </Button>
                      </Box>
                    </>
                  )}
                </Box>
              )}
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
};

export default CommentSection;
