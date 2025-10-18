import logo1 from "../../../assets/img/logoromand.jpeg";
import logo2 from "../../../assets/img/logoromand2.jpg";
import logo3 from "../../../assets/img/logosuatam.jpeg";
import logo4 from "../../../assets/img/logosuaruamat.jpg";
import logo5 from "../../../assets/img/logophan.png";
import logo6 from "../../../assets/img/phanlogo.jpg";
import logo7 from "../../../assets/img/logoCategory.jpg";
import logo8 from "../../../assets/img/logoCategory2.jpg";
export const navigation = {
  categories: [
    {
      id: "category",
      name: "Danh mục sản phẩm",
      featured: [
        {
          name: "Sản phẩm nổi bật",
          href: "/",
          imageSrc: logo7,
          imageAlt: "Hình ảnh minh họa sản phẩm nổi bật.",
        },
        {
          name: "Khuyến mãi đặc biệt",
          href: "/",
          imageSrc: logo8,
          imageAlt: "Sản phẩm trong chương trình giảm giá.",
        },
      ],
      sections: [
        {
          id: "mypham",
          name: "Mỹ phẩm",
          items: [
            {
              name: "Trang điểm",
              id: "trang_diem",
              href: "/my-pham/trang-diem",
            },
            {
              name: "Chăm sóc da mặt",
              id: "cham_soc_da_mat",
              href: "/my-pham/cham-soc-da-mat",
            },
            {
              name: "Chăm sóc cơ thể",
              id: "cham_soc_co_the",
              href: "/my-pham/cham-soc-co-the",
            },
            {
              name: "Chăm sóc tóc & da đầu",
              id: "cham_soc_toc",
              href: "/my-pham/cham-soc-toc",
            },
            {
              name: "Chăm sóc cá nhân",
              id: "cham_soc_ca_nhan",
              href: "/my-pham/cham-soc-ca-nhan",
            },
            { name: "Nước hoa", id: "nuoc_hoa", href: "/my-pham/nuoc-hoa" },
            {
              name: "Thiết bị làm đẹp",
              id: "thiet_bi_lam_dep",
              href: "/my-pham/thiet-bi-lam-dep",
            },
            {
              name: "Thực phẩm chức năng",
              id: "thuc_pham_chuc_nang",
              href: "/my-pham/thuc-pham-chuc-nang",
            },
            {
              name: "Dụng cụ trang điểm",
              id: "dung_cu_trang_diem",
              href: "/my-pham/dung-cu-trang-diem",
            },
          ],
        },
      ],
    },
    {
      id: "trang_diem",
      name: "Trang điểm",
      featured: [
        {
          name: "Sản phẩm nổi bật",
          id: "#",
          imageSrc: logo5,
          imageAlt: "Các sản phẩm trang điểm được ưa chuộng nhất.",
        },
        {
          name: "Bộ sưu tập mới",
          id: "#",
          imageSrc: logo6,
          imageAlt: "Bộ sản phẩm trang điểm mới nhất.",
        },
      ],
      sections: [
        {
          id: "mat",
          name: "Mặt",
          items: [
            { name: "Kem Lót/Base", id: "kem_lot" },
            { name: "Che Khuyết Điểm", id: "che_khuyet_diem" },
            { name: "BB Cream/Kem Nền", id: "bb_cream" },
            { name: "Phấn Nước/Cushion", id: "phan_nuoc" },
            { name: "Phấn Nền/Phấn Phủ", id: "phan_phu" },
            { name: "Má Hồng", id: "ma_hong" },
            { name: "Tạo Khối/Highlighter", id: "tao_khoi" },
            { name: "Xịt Cố Định Make Up", id: "xit_co_dinh" },
            { name: "Bộ Make Up", id: "bo_makeup" },
          ],
        },
        {
          id: "mat2",
          name: "Mắt",
          items: [
            { name: "Phấn Mắt/Nhũ Mắt", id: "phan_mat" },
            { name: "Kẻ Chân Mày", id: "ke_chan_may" },
            { name: "Mascara Chân Mày", id: "mascara_chan_may" },
            { name: "Kẻ Viền Mắt/Eyeliner", id: "ke_mat" },
            { name: "Mascara", id: "mascara" },
          ],
        },
      ],
    },
    {
      id: "cham_soc_da",
      name: "Chăm sóc da",
      featured: [
        {
          name: "Sản phẩm dưỡng da nổi bật",
          id: "#",
          imageSrc: logo4,
          imageAlt: "Các sản phẩm dưỡng da được yêu thích.",
        },
        {
          name: "Bộ sưu tập dưỡng thể mới",
          id: "#",
          imageSrc: logo3,
          imageAlt: "Bộ sản phẩm chăm sóc cơ thể mới nhất.",
        },
      ],
      sections: [
        {
          id: "duong_da",
          name: "Quy trình dưỡng da",
          items: [
            { name: "Tẩy Trang", id: "tay_trang" },
            { name: "Sữa Rửa Mặt", id: "sua_rua_mat" },
            { name: "Mặt Nạ Rửa/Miếng/Ngủ", id: "mat_na" },
            { name: "Tẩy Tế Bào Chết", id: "tay_te_bao_chet" },
            { name: "Nước Hoa Hồng", id: "nuoc_hoa_hong" },
            { name: "Tinh Chất Dưỡng", id: "tinh_chat_duong" },
            { name: "Sữa Dưỡng", id: "sua_duong" },
            { name: "Dán Mụn/Chấm Mụn", id: "dan_mun" },
            { name: "Kem/Gel Dưỡng Ẩm", id: "kem_duong_am" },
            { name: "Kem Tone Up", id: "kem_tone_up" },
            { name: "Xịt Khoáng", id: "xit_khoang" },
            { name: "Chống Nắng", id: "chong_nang" },
            { name: "Dưỡng Mắt/Mi", id: "duong_mat_mi" },
            { name: "Giấy/Phim/Lăn Thấm Dầu", id: "giay_tham_dau" },
          ],
        },
        {
          id: "co_the",
          name: "Chăm sóc cơ thể",
          items: [
            { name: "Sữa Tắm", id: "sua_tam" },
            { name: "Xà Phòng", id: "xa_phong" },
            { name: "Dưỡng Thể", id: "duong_the" },
            { name: "Tẩy Da Chết Body", id: "tay_da_chet_body" },
            { name: "Khử Mùi", id: "khu_mui" },
            { name: "Dưỡng Da Tay/Chân", id: "duong_tay_chan" },
            { name: "Tẩy Lông", id: "tay_long" },
            { name: "Đánh Tan Mỡ", id: "danh_tan_mo" },
            { name: "Chăm Sóc Tóc & Da Đầu", id: "cham_soc_toc_da_dau" },
          ],
        },
      ],
    },
    {
      id: "thuong_hieu",
      name: "Thương hiệu",
      featured: [
        {
          name: "Thương hiệu nổi bật",
          id: "#",
          imageSrc: logo1,
          imageAlt: "Các thương hiệu mỹ phẩm được yêu thích.",
        },
        {
          name: "Bộ sưu tập thương hiệu mới",
          id: "#",
          imageSrc: logo2,
          imageAlt: "Những thương hiệu làm đẹp mới nhất.",
        },
      ],
      sections: [
        {
          id: "thuong_hieu_noi_bat",
          name: "Thương hiệu phổ biến",
          items: [
            { name: "Merzy", id: "merzy" },
            { name: "Cocoon", id: "cocoon" },
            { name: "Balance", id: "balance" },
            { name: "Missha", id: "missha" },
            { name: "Mediheal", id: "mediheal" },
            { name: "Maybelline", id: "maybelline" },
            { name: "Vacosi", id: "vacosi" },
            { name: "Neogen", id: "neogen" },
            { name: "Silkygirl", id: "silkygirl" },
            { name: "Eucerin", id: "eucerin" },
            { name: "Benton", id: "benton" },
          ],
        },
        {
          id: "thuong_hieu_noi_bat",
          name: "Thương hiệu mới",
          items: [
            { name: "Romand", id: "romand" },
            { name: "Beldora", id: "beldora" },
            { name: "Skin1004", id: "skin1004" },
            { name: "3CE", id: "3ce" },
            { name: "Bioderma", id: "bioderma" },
            { name: "Black Rouge", id: "black_rouge" },
            { name: "Vaseline", id: "vaseline" },
            { name: "Karadium", id: "karadium" },
            { name: "Huxley", id: "huxley" },
            { name: "JMsolution", id: "jmsolution" },
            { name: "Zeesea", id: "zeesea" },
          ],
        },
      ],
    },
  ],
};
