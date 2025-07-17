import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Avatar, Button, Rating, Paper, Chip, IconButton } from "@mui/material";
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
    setDeleting(id);
    try {
      await axios.delete(ENDPOINTS.DELETE_COMMENT_BY_ID(id), {
        headers: { "ngrok-skip-browser-warning": "true" },
      });
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert('Xóa bình luận thất bại!');
    } finally {
      setDeleting(null);
    }
  };

  const filteredComments = filter
    ? comments.filter((c) => c.review_rate === filter)
    : comments;

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
        {filteredComments.map((c, idx) => (
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
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default CommentSection;
