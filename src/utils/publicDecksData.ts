import { Deck } from '../store/deckStore';
import { Flashcard } from '../store/flashcardStore';

export const HARDCODED_PUBLIC_DECKS: Deck[] = [
  {
    deckId: 'public_1',
    name: 'Tiếng Anh Giao Tiếp Cơ Bản',
    description: 'Các mẫu câu thông dụng nhất trong giao tiếp hàng ngày',
    createdAt: Date.now() - 1000000,
    isPublic: true,
    shareCode: 'ENG101',
    
  },
  {
    deckId: 'public_2',
    name: 'Biển Báo Giao Thông VN',
    description: 'Ôn thi lý thuyết bằng lái xe máy/ô tô',
    createdAt: Date.now() - 2000000,
    isPublic: true,
    shareCode: 'GIAOTH',
    
  },
  {
    deckId: 'public_3',
    name: 'Văn hóa và Du lịch Nhật Bản',
    description: 'Khám phá xứ sở hoa anh đào',
    createdAt: Date.now() - 3000000,
    isPublic: true,
    shareCode: 'JAPAN',
    
  },
  {
    deckId: 'public_4',
    name: 'Vật lý Lượng tử (Cơ bản)',
    description: 'Dành cho những người đam mê khoa học',
    createdAt: Date.now() - 4000000,
    isPublic: true,
    shareCode: 'PHYSIC',
    
  },
  {
    deckId: 'public_5',
    name: 'Lịch sử Cổ đại Thế giới',
    description: 'Ai Cập, Hy Lạp, La Mã và hơn thế nữa',
    createdAt: Date.now() - 5000000,
    isPublic: true,
    shareCode: 'HISTOR',
    
  }
  ,
  {
    "deckId": "public_6",
    "name": "Test Deck Large 6",
    "description": "Bộ thẻ test chứa 45 thẻ tự động tạo",
    "createdAt": 1776768531397,
    "isPublic": true,
    "shareCode": "TEST6"
  },
  {
    "deckId": "public_7",
    "name": "Test Deck Large 7",
    "description": "Bộ thẻ test chứa 45 thẻ tự động tạo",
    "createdAt": 1776767531397,
    "isPublic": true,
    "shareCode": "TEST7"
  },
  {
    "deckId": "public_8",
    "name": "Test Deck Large 8",
    "description": "Bộ thẻ test chứa 45 thẻ tự động tạo",
    "createdAt": 1776766531397,
    "isPublic": true,
    "shareCode": "TEST8"
  },
  {
    "deckId": "public_9",
    "name": "Test Deck Large 9",
    "description": "Bộ thẻ test chứa 45 thẻ tự động tạo",
    "createdAt": 1776765531397,
    "isPublic": true,
    "shareCode": "TEST9"
  },
  {
    "deckId": "public_10",
    "name": "Test Deck Large 10",
    "description": "Bộ thẻ test chứa 45 thẻ tự động tạo",
    "createdAt": 1776764531397,
    "isPublic": true,
    "shareCode": "TEST10"
  }

];

export const HARDCODED_PUBLIC_CARDS: Record<string, any[]> = {
  'public_1': [
    ['How are you doing?', 'Bạn dạo này thế nào?', 'Dùng để chào hỏi một cách thân thiện.'],
    ['What do you do for a living?', 'Bạn làm nghề gì?', 'Cách lịch sự để hỏi về nghề nghiệp.'],
    ['Could you repeat that, please?', 'Bạn có thể nhắc lại được không?', 'Khi bạn không nghe rõ.'],
    ['I appreciate your help.', 'Tôi rất trân trọng sự giúp đỡ của bạn.', 'Cách cảm ơn chân thành.'],
    ['Let\'s catch up later.', 'Chúng ta nói chuyện sau nhé.', 'Khi muốn kết thúc cuộc trò chuyện.'],
    ['It’s up to you.', 'Tùy bạn quyết định.', 'Giao quyền quyết định cho người khác.'],
    ['I’m looking forward to it.', 'Tôi rất mong chờ điều đó.', 'Thể hiện sự háo hức.'],
    ['That makes sense.', 'Điều đó hợp lý đấy.', 'Đồng tình với một quan điểm.'],
    ['Don’t mention it.', 'Không có chi.', 'Đáp lại lời cảm ơn (thân mật).'],
    ['I’m a bit tied up right now.', 'Bây giờ tôi hơi bận.', 'Từ chối khéo léo.']
  ],
  'public_2': [
    ['Biển cấm đi ngược chiều có hình dạng và màu sắc thế nào?', 'Hình tròn, nền đỏ, gạch ngang trắng', 'Biển số P.102'],
    ['Biển báo nguy hiểm có đặc điểm gì?', 'Hình tam giác đều, viền đỏ, nền vàng', 'Cảnh báo tình huống nguy hiểm phía trước.'],
    ['Biển báo hiệu lệnh có đặc điểm gì?', 'Hình tròn, nền xanh lam, hình vẽ trắng', 'Bắt buộc người tham gia giao thông phải thi hành.'],
    ['Biển STOP (Dừng lại) có hình dạng gì?', 'Hình bát giác, nền đỏ, chữ trắng', 'Bắt buộc dừng lại trước vạch dừng.'],
    ['Vạch kẻ đường màu vàng nét đứt có ý nghĩa gì?', 'Phân chia 2 chiều xe chạy, được phép lấn làn', 'Khác với vạch liền là cấm lấn làn.']
  ],
  'public_3': [
    ['Trang phục truyền thống của Nhật Bản là gì?', 'Kimono', 'Thường mặc trong các dịp lễ tết, cưới hỏi.'],
    ['Ngọn núi cao nhất Nhật Bản là gì?', 'Núi Phú Sĩ (Fuji)', 'Biểu tượng linh thiêng của Nhật Bản.'],
    ['Nghệ thuật gấp giấy Nhật Bản gọi là gì?', 'Origami', 'Tạo ra các hình thù phức tạp từ một tờ giấy vuông.'],
    ['Món ăn truyền thống làm từ cơm trộn giấm và hải sản sống là gì?', 'Sushi', 'Nổi tiếng trên toàn thế giới.'],
    ['Cổng đền Thần Đạo (Shinto) màu đỏ thường thấy ở Nhật gọi là gì?', 'Torii', 'Đánh dấu sự chuyển tiếp từ thế giới trần tục sang nơi linh thiêng.']
  ],
  'public_4': [
    ['Ai là người đưa ra Thuyết Tương Đối?', 'Albert Einstein', 'E = mc²'],
    ['Hạt cơ bản mang điện tích âm quay quanh hạt nhân là gì?', 'Electron', 'Khối lượng rất nhỏ so với proton.'],
    ['Con mèo của Schrödinger là một thí nghiệm tưởng tượng nhằm minh họa cho nguyên lý nào?', 'Nguyên lý chồng chập lượng tử', 'Con mèo vừa sống vừa chết cho đến khi được quan sát.'],
    ['Hạt ánh sáng được gọi là gì?', 'Photon', 'Không có khối lượng nghỉ.'],
    ['Trạng thái mà các hạt liên kết với nhau đến mức trạng thái của một hạt phụ thuộc vào hạt kia dù ở rất xa?', 'Rối lượng tử (Quantum Entanglement)', 'Einstein gọi là "tác động ma quái từ xa".']
  ],
  'public_5': [
    ['Kỳ quan duy nhất trong Bảy kỳ quan thế giới cổ đại còn tồn tại đến ngày nay?', 'Đại kim tự tháp Giza', 'Nằm ở Ai Cập.'],
    ['Nền văn minh nào đã phát minh ra chữ viết hình nêm (cuneiform)?', 'Sumer (Lưỡng Hà)', 'Một trong những hệ thống chữ viết lâu đời nhất.'],
    ['Thành Rome (La Mã) được truyền thuyết kể là do ai sáng lập?', 'Romulus và Remus', 'Hai anh em sinh đôi được nuôi dưỡng bởi một con sói.'],
    ['Đế chế nào được Alexander Đại Đế chinh phục và mở rộng lớn nhất trong thế giới cổ đại?', 'Đế quốc Ba Tư', 'Alexander chưa từng thua một trận đánh nào.'],
    ['Vị pharaoh nữ nổi tiếng nhất của Ai Cập cổ đại, có mối tình với Julius Caesar là ai?', 'Cleopatra', 'Là vị pharaoh cuối cùng của Ai Cập cổ đại.']
  ]
,
  'public_6': [
    [
        "Câu hỏi test 1 của bộ 6",
        "Đáp án test 1",
        "Giải thích test 1"
    ],
    [
        "Câu hỏi test 2 của bộ 6",
        "Đáp án test 2",
        "Giải thích test 2"
    ],
    [
        "Câu hỏi test 3 của bộ 6",
        "Đáp án test 3",
        "Giải thích test 3"
    ],
    [
        "Câu hỏi test 4 của bộ 6",
        "Đáp án test 4",
        "Giải thích test 4"
    ],
    [
        "Câu hỏi test 5 của bộ 6",
        "Đáp án test 5",
        "Giải thích test 5"
    ],
    [
        "Câu hỏi test 6 của bộ 6",
        "Đáp án test 6",
        "Giải thích test 6"
    ],
    [
        "Câu hỏi test 7 của bộ 6",
        "Đáp án test 7",
        "Giải thích test 7"
    ],
    [
        "Câu hỏi test 8 của bộ 6",
        "Đáp án test 8",
        "Giải thích test 8"
    ],
    [
        "Câu hỏi test 9 của bộ 6",
        "Đáp án test 9",
        "Giải thích test 9"
    ],
    [
        "Câu hỏi test 10 của bộ 6",
        "Đáp án test 10",
        "Giải thích test 10"
    ],
    [
        "Câu hỏi test 11 của bộ 6",
        "Đáp án test 11",
        "Giải thích test 11"
    ],
    [
        "Câu hỏi test 12 của bộ 6",
        "Đáp án test 12",
        "Giải thích test 12"
    ],
    [
        "Câu hỏi test 13 của bộ 6",
        "Đáp án test 13",
        "Giải thích test 13"
    ],
    [
        "Câu hỏi test 14 của bộ 6",
        "Đáp án test 14",
        "Giải thích test 14"
    ],
    [
        "Câu hỏi test 15 của bộ 6",
        "Đáp án test 15",
        "Giải thích test 15"
    ],
    [
        "Câu hỏi test 16 của bộ 6",
        "Đáp án test 16",
        "Giải thích test 16"
    ],
    [
        "Câu hỏi test 17 của bộ 6",
        "Đáp án test 17",
        "Giải thích test 17"
    ],
    [
        "Câu hỏi test 18 của bộ 6",
        "Đáp án test 18",
        "Giải thích test 18"
    ],
    [
        "Câu hỏi test 19 của bộ 6",
        "Đáp án test 19",
        "Giải thích test 19"
    ],
    [
        "Câu hỏi test 20 của bộ 6",
        "Đáp án test 20",
        "Giải thích test 20"
    ],
    [
        "Câu hỏi test 21 của bộ 6",
        "Đáp án test 21",
        "Giải thích test 21"
    ],
    [
        "Câu hỏi test 22 của bộ 6",
        "Đáp án test 22",
        "Giải thích test 22"
    ],
    [
        "Câu hỏi test 23 của bộ 6",
        "Đáp án test 23",
        "Giải thích test 23"
    ],
    [
        "Câu hỏi test 24 của bộ 6",
        "Đáp án test 24",
        "Giải thích test 24"
    ],
    [
        "Câu hỏi test 25 của bộ 6",
        "Đáp án test 25",
        "Giải thích test 25"
    ],
    [
        "Câu hỏi test 26 của bộ 6",
        "Đáp án test 26",
        "Giải thích test 26"
    ],
    [
        "Câu hỏi test 27 của bộ 6",
        "Đáp án test 27",
        "Giải thích test 27"
    ],
    [
        "Câu hỏi test 28 của bộ 6",
        "Đáp án test 28",
        "Giải thích test 28"
    ],
    [
        "Câu hỏi test 29 của bộ 6",
        "Đáp án test 29",
        "Giải thích test 29"
    ],
    [
        "Câu hỏi test 30 của bộ 6",
        "Đáp án test 30",
        "Giải thích test 30"
    ],
    [
        "Câu hỏi test 31 của bộ 6",
        "Đáp án test 31",
        "Giải thích test 31"
    ],
    [
        "Câu hỏi test 32 của bộ 6",
        "Đáp án test 32",
        "Giải thích test 32"
    ],
    [
        "Câu hỏi test 33 của bộ 6",
        "Đáp án test 33",
        "Giải thích test 33"
    ],
    [
        "Câu hỏi test 34 của bộ 6",
        "Đáp án test 34",
        "Giải thích test 34"
    ],
    [
        "Câu hỏi test 35 của bộ 6",
        "Đáp án test 35",
        "Giải thích test 35"
    ],
    [
        "Câu hỏi test 36 của bộ 6",
        "Đáp án test 36",
        "Giải thích test 36"
    ],
    [
        "Câu hỏi test 37 của bộ 6",
        "Đáp án test 37",
        "Giải thích test 37"
    ],
    [
        "Câu hỏi test 38 của bộ 6",
        "Đáp án test 38",
        "Giải thích test 38"
    ],
    [
        "Câu hỏi test 39 của bộ 6",
        "Đáp án test 39",
        "Giải thích test 39"
    ],
    [
        "Câu hỏi test 40 của bộ 6",
        "Đáp án test 40",
        "Giải thích test 40"
    ],
    [
        "Câu hỏi test 41 của bộ 6",
        "Đáp án test 41",
        "Giải thích test 41"
    ],
    [
        "Câu hỏi test 42 của bộ 6",
        "Đáp án test 42",
        "Giải thích test 42"
    ],
    [
        "Câu hỏi test 43 của bộ 6",
        "Đáp án test 43",
        "Giải thích test 43"
    ],
    [
        "Câu hỏi test 44 của bộ 6",
        "Đáp án test 44",
        "Giải thích test 44"
    ],
    [
        "Câu hỏi test 45 của bộ 6",
        "Đáp án test 45",
        "Giải thích test 45"
    ]
],
  'public_7': [
    [
        "Câu hỏi test 1 của bộ 7",
        "Đáp án test 1",
        "Giải thích test 1"
    ],
    [
        "Câu hỏi test 2 của bộ 7",
        "Đáp án test 2",
        "Giải thích test 2"
    ],
    [
        "Câu hỏi test 3 của bộ 7",
        "Đáp án test 3",
        "Giải thích test 3"
    ],
    [
        "Câu hỏi test 4 của bộ 7",
        "Đáp án test 4",
        "Giải thích test 4"
    ],
    [
        "Câu hỏi test 5 của bộ 7",
        "Đáp án test 5",
        "Giải thích test 5"
    ],
    [
        "Câu hỏi test 6 của bộ 7",
        "Đáp án test 6",
        "Giải thích test 6"
    ],
    [
        "Câu hỏi test 7 của bộ 7",
        "Đáp án test 7",
        "Giải thích test 7"
    ],
    [
        "Câu hỏi test 8 của bộ 7",
        "Đáp án test 8",
        "Giải thích test 8"
    ],
    [
        "Câu hỏi test 9 của bộ 7",
        "Đáp án test 9",
        "Giải thích test 9"
    ],
    [
        "Câu hỏi test 10 của bộ 7",
        "Đáp án test 10",
        "Giải thích test 10"
    ],
    [
        "Câu hỏi test 11 của bộ 7",
        "Đáp án test 11",
        "Giải thích test 11"
    ],
    [
        "Câu hỏi test 12 của bộ 7",
        "Đáp án test 12",
        "Giải thích test 12"
    ],
    [
        "Câu hỏi test 13 của bộ 7",
        "Đáp án test 13",
        "Giải thích test 13"
    ],
    [
        "Câu hỏi test 14 của bộ 7",
        "Đáp án test 14",
        "Giải thích test 14"
    ],
    [
        "Câu hỏi test 15 của bộ 7",
        "Đáp án test 15",
        "Giải thích test 15"
    ],
    [
        "Câu hỏi test 16 của bộ 7",
        "Đáp án test 16",
        "Giải thích test 16"
    ],
    [
        "Câu hỏi test 17 của bộ 7",
        "Đáp án test 17",
        "Giải thích test 17"
    ],
    [
        "Câu hỏi test 18 của bộ 7",
        "Đáp án test 18",
        "Giải thích test 18"
    ],
    [
        "Câu hỏi test 19 của bộ 7",
        "Đáp án test 19",
        "Giải thích test 19"
    ],
    [
        "Câu hỏi test 20 của bộ 7",
        "Đáp án test 20",
        "Giải thích test 20"
    ],
    [
        "Câu hỏi test 21 của bộ 7",
        "Đáp án test 21",
        "Giải thích test 21"
    ],
    [
        "Câu hỏi test 22 của bộ 7",
        "Đáp án test 22",
        "Giải thích test 22"
    ],
    [
        "Câu hỏi test 23 của bộ 7",
        "Đáp án test 23",
        "Giải thích test 23"
    ],
    [
        "Câu hỏi test 24 của bộ 7",
        "Đáp án test 24",
        "Giải thích test 24"
    ],
    [
        "Câu hỏi test 25 của bộ 7",
        "Đáp án test 25",
        "Giải thích test 25"
    ],
    [
        "Câu hỏi test 26 của bộ 7",
        "Đáp án test 26",
        "Giải thích test 26"
    ],
    [
        "Câu hỏi test 27 của bộ 7",
        "Đáp án test 27",
        "Giải thích test 27"
    ],
    [
        "Câu hỏi test 28 của bộ 7",
        "Đáp án test 28",
        "Giải thích test 28"
    ],
    [
        "Câu hỏi test 29 của bộ 7",
        "Đáp án test 29",
        "Giải thích test 29"
    ],
    [
        "Câu hỏi test 30 của bộ 7",
        "Đáp án test 30",
        "Giải thích test 30"
    ],
    [
        "Câu hỏi test 31 của bộ 7",
        "Đáp án test 31",
        "Giải thích test 31"
    ],
    [
        "Câu hỏi test 32 của bộ 7",
        "Đáp án test 32",
        "Giải thích test 32"
    ],
    [
        "Câu hỏi test 33 của bộ 7",
        "Đáp án test 33",
        "Giải thích test 33"
    ],
    [
        "Câu hỏi test 34 của bộ 7",
        "Đáp án test 34",
        "Giải thích test 34"
    ],
    [
        "Câu hỏi test 35 của bộ 7",
        "Đáp án test 35",
        "Giải thích test 35"
    ],
    [
        "Câu hỏi test 36 của bộ 7",
        "Đáp án test 36",
        "Giải thích test 36"
    ],
    [
        "Câu hỏi test 37 của bộ 7",
        "Đáp án test 37",
        "Giải thích test 37"
    ],
    [
        "Câu hỏi test 38 của bộ 7",
        "Đáp án test 38",
        "Giải thích test 38"
    ],
    [
        "Câu hỏi test 39 của bộ 7",
        "Đáp án test 39",
        "Giải thích test 39"
    ],
    [
        "Câu hỏi test 40 của bộ 7",
        "Đáp án test 40",
        "Giải thích test 40"
    ],
    [
        "Câu hỏi test 41 của bộ 7",
        "Đáp án test 41",
        "Giải thích test 41"
    ],
    [
        "Câu hỏi test 42 của bộ 7",
        "Đáp án test 42",
        "Giải thích test 42"
    ],
    [
        "Câu hỏi test 43 của bộ 7",
        "Đáp án test 43",
        "Giải thích test 43"
    ],
    [
        "Câu hỏi test 44 của bộ 7",
        "Đáp án test 44",
        "Giải thích test 44"
    ],
    [
        "Câu hỏi test 45 của bộ 7",
        "Đáp án test 45",
        "Giải thích test 45"
    ]
],
  'public_8': [
    [
        "Câu hỏi test 1 của bộ 8",
        "Đáp án test 1",
        "Giải thích test 1"
    ],
    [
        "Câu hỏi test 2 của bộ 8",
        "Đáp án test 2",
        "Giải thích test 2"
    ],
    [
        "Câu hỏi test 3 của bộ 8",
        "Đáp án test 3",
        "Giải thích test 3"
    ],
    [
        "Câu hỏi test 4 của bộ 8",
        "Đáp án test 4",
        "Giải thích test 4"
    ],
    [
        "Câu hỏi test 5 của bộ 8",
        "Đáp án test 5",
        "Giải thích test 5"
    ],
    [
        "Câu hỏi test 6 của bộ 8",
        "Đáp án test 6",
        "Giải thích test 6"
    ],
    [
        "Câu hỏi test 7 của bộ 8",
        "Đáp án test 7",
        "Giải thích test 7"
    ],
    [
        "Câu hỏi test 8 của bộ 8",
        "Đáp án test 8",
        "Giải thích test 8"
    ],
    [
        "Câu hỏi test 9 của bộ 8",
        "Đáp án test 9",
        "Giải thích test 9"
    ],
    [
        "Câu hỏi test 10 của bộ 8",
        "Đáp án test 10",
        "Giải thích test 10"
    ],
    [
        "Câu hỏi test 11 của bộ 8",
        "Đáp án test 11",
        "Giải thích test 11"
    ],
    [
        "Câu hỏi test 12 của bộ 8",
        "Đáp án test 12",
        "Giải thích test 12"
    ],
    [
        "Câu hỏi test 13 của bộ 8",
        "Đáp án test 13",
        "Giải thích test 13"
    ],
    [
        "Câu hỏi test 14 của bộ 8",
        "Đáp án test 14",
        "Giải thích test 14"
    ],
    [
        "Câu hỏi test 15 của bộ 8",
        "Đáp án test 15",
        "Giải thích test 15"
    ],
    [
        "Câu hỏi test 16 của bộ 8",
        "Đáp án test 16",
        "Giải thích test 16"
    ],
    [
        "Câu hỏi test 17 của bộ 8",
        "Đáp án test 17",
        "Giải thích test 17"
    ],
    [
        "Câu hỏi test 18 của bộ 8",
        "Đáp án test 18",
        "Giải thích test 18"
    ],
    [
        "Câu hỏi test 19 của bộ 8",
        "Đáp án test 19",
        "Giải thích test 19"
    ],
    [
        "Câu hỏi test 20 của bộ 8",
        "Đáp án test 20",
        "Giải thích test 20"
    ],
    [
        "Câu hỏi test 21 của bộ 8",
        "Đáp án test 21",
        "Giải thích test 21"
    ],
    [
        "Câu hỏi test 22 của bộ 8",
        "Đáp án test 22",
        "Giải thích test 22"
    ],
    [
        "Câu hỏi test 23 của bộ 8",
        "Đáp án test 23",
        "Giải thích test 23"
    ],
    [
        "Câu hỏi test 24 của bộ 8",
        "Đáp án test 24",
        "Giải thích test 24"
    ],
    [
        "Câu hỏi test 25 của bộ 8",
        "Đáp án test 25",
        "Giải thích test 25"
    ],
    [
        "Câu hỏi test 26 của bộ 8",
        "Đáp án test 26",
        "Giải thích test 26"
    ],
    [
        "Câu hỏi test 27 của bộ 8",
        "Đáp án test 27",
        "Giải thích test 27"
    ],
    [
        "Câu hỏi test 28 của bộ 8",
        "Đáp án test 28",
        "Giải thích test 28"
    ],
    [
        "Câu hỏi test 29 của bộ 8",
        "Đáp án test 29",
        "Giải thích test 29"
    ],
    [
        "Câu hỏi test 30 của bộ 8",
        "Đáp án test 30",
        "Giải thích test 30"
    ],
    [
        "Câu hỏi test 31 của bộ 8",
        "Đáp án test 31",
        "Giải thích test 31"
    ],
    [
        "Câu hỏi test 32 của bộ 8",
        "Đáp án test 32",
        "Giải thích test 32"
    ],
    [
        "Câu hỏi test 33 của bộ 8",
        "Đáp án test 33",
        "Giải thích test 33"
    ],
    [
        "Câu hỏi test 34 của bộ 8",
        "Đáp án test 34",
        "Giải thích test 34"
    ],
    [
        "Câu hỏi test 35 của bộ 8",
        "Đáp án test 35",
        "Giải thích test 35"
    ],
    [
        "Câu hỏi test 36 của bộ 8",
        "Đáp án test 36",
        "Giải thích test 36"
    ],
    [
        "Câu hỏi test 37 của bộ 8",
        "Đáp án test 37",
        "Giải thích test 37"
    ],
    [
        "Câu hỏi test 38 của bộ 8",
        "Đáp án test 38",
        "Giải thích test 38"
    ],
    [
        "Câu hỏi test 39 của bộ 8",
        "Đáp án test 39",
        "Giải thích test 39"
    ],
    [
        "Câu hỏi test 40 của bộ 8",
        "Đáp án test 40",
        "Giải thích test 40"
    ],
    [
        "Câu hỏi test 41 của bộ 8",
        "Đáp án test 41",
        "Giải thích test 41"
    ],
    [
        "Câu hỏi test 42 của bộ 8",
        "Đáp án test 42",
        "Giải thích test 42"
    ],
    [
        "Câu hỏi test 43 của bộ 8",
        "Đáp án test 43",
        "Giải thích test 43"
    ],
    [
        "Câu hỏi test 44 của bộ 8",
        "Đáp án test 44",
        "Giải thích test 44"
    ],
    [
        "Câu hỏi test 45 của bộ 8",
        "Đáp án test 45",
        "Giải thích test 45"
    ]
],
  'public_9': [
    [
        "Câu hỏi test 1 của bộ 9",
        "Đáp án test 1",
        "Giải thích test 1"
    ],
    [
        "Câu hỏi test 2 của bộ 9",
        "Đáp án test 2",
        "Giải thích test 2"
    ],
    [
        "Câu hỏi test 3 của bộ 9",
        "Đáp án test 3",
        "Giải thích test 3"
    ],
    [
        "Câu hỏi test 4 của bộ 9",
        "Đáp án test 4",
        "Giải thích test 4"
    ],
    [
        "Câu hỏi test 5 của bộ 9",
        "Đáp án test 5",
        "Giải thích test 5"
    ],
    [
        "Câu hỏi test 6 của bộ 9",
        "Đáp án test 6",
        "Giải thích test 6"
    ],
    [
        "Câu hỏi test 7 của bộ 9",
        "Đáp án test 7",
        "Giải thích test 7"
    ],
    [
        "Câu hỏi test 8 của bộ 9",
        "Đáp án test 8",
        "Giải thích test 8"
    ],
    [
        "Câu hỏi test 9 của bộ 9",
        "Đáp án test 9",
        "Giải thích test 9"
    ],
    [
        "Câu hỏi test 10 của bộ 9",
        "Đáp án test 10",
        "Giải thích test 10"
    ],
    [
        "Câu hỏi test 11 của bộ 9",
        "Đáp án test 11",
        "Giải thích test 11"
    ],
    [
        "Câu hỏi test 12 của bộ 9",
        "Đáp án test 12",
        "Giải thích test 12"
    ],
    [
        "Câu hỏi test 13 của bộ 9",
        "Đáp án test 13",
        "Giải thích test 13"
    ],
    [
        "Câu hỏi test 14 của bộ 9",
        "Đáp án test 14",
        "Giải thích test 14"
    ],
    [
        "Câu hỏi test 15 của bộ 9",
        "Đáp án test 15",
        "Giải thích test 15"
    ],
    [
        "Câu hỏi test 16 của bộ 9",
        "Đáp án test 16",
        "Giải thích test 16"
    ],
    [
        "Câu hỏi test 17 của bộ 9",
        "Đáp án test 17",
        "Giải thích test 17"
    ],
    [
        "Câu hỏi test 18 của bộ 9",
        "Đáp án test 18",
        "Giải thích test 18"
    ],
    [
        "Câu hỏi test 19 của bộ 9",
        "Đáp án test 19",
        "Giải thích test 19"
    ],
    [
        "Câu hỏi test 20 của bộ 9",
        "Đáp án test 20",
        "Giải thích test 20"
    ],
    [
        "Câu hỏi test 21 của bộ 9",
        "Đáp án test 21",
        "Giải thích test 21"
    ],
    [
        "Câu hỏi test 22 của bộ 9",
        "Đáp án test 22",
        "Giải thích test 22"
    ],
    [
        "Câu hỏi test 23 của bộ 9",
        "Đáp án test 23",
        "Giải thích test 23"
    ],
    [
        "Câu hỏi test 24 của bộ 9",
        "Đáp án test 24",
        "Giải thích test 24"
    ],
    [
        "Câu hỏi test 25 của bộ 9",
        "Đáp án test 25",
        "Giải thích test 25"
    ],
    [
        "Câu hỏi test 26 của bộ 9",
        "Đáp án test 26",
        "Giải thích test 26"
    ],
    [
        "Câu hỏi test 27 của bộ 9",
        "Đáp án test 27",
        "Giải thích test 27"
    ],
    [
        "Câu hỏi test 28 của bộ 9",
        "Đáp án test 28",
        "Giải thích test 28"
    ],
    [
        "Câu hỏi test 29 của bộ 9",
        "Đáp án test 29",
        "Giải thích test 29"
    ],
    [
        "Câu hỏi test 30 của bộ 9",
        "Đáp án test 30",
        "Giải thích test 30"
    ],
    [
        "Câu hỏi test 31 của bộ 9",
        "Đáp án test 31",
        "Giải thích test 31"
    ],
    [
        "Câu hỏi test 32 của bộ 9",
        "Đáp án test 32",
        "Giải thích test 32"
    ],
    [
        "Câu hỏi test 33 của bộ 9",
        "Đáp án test 33",
        "Giải thích test 33"
    ],
    [
        "Câu hỏi test 34 của bộ 9",
        "Đáp án test 34",
        "Giải thích test 34"
    ],
    [
        "Câu hỏi test 35 của bộ 9",
        "Đáp án test 35",
        "Giải thích test 35"
    ],
    [
        "Câu hỏi test 36 của bộ 9",
        "Đáp án test 36",
        "Giải thích test 36"
    ],
    [
        "Câu hỏi test 37 của bộ 9",
        "Đáp án test 37",
        "Giải thích test 37"
    ],
    [
        "Câu hỏi test 38 của bộ 9",
        "Đáp án test 38",
        "Giải thích test 38"
    ],
    [
        "Câu hỏi test 39 của bộ 9",
        "Đáp án test 39",
        "Giải thích test 39"
    ],
    [
        "Câu hỏi test 40 của bộ 9",
        "Đáp án test 40",
        "Giải thích test 40"
    ],
    [
        "Câu hỏi test 41 của bộ 9",
        "Đáp án test 41",
        "Giải thích test 41"
    ],
    [
        "Câu hỏi test 42 của bộ 9",
        "Đáp án test 42",
        "Giải thích test 42"
    ],
    [
        "Câu hỏi test 43 của bộ 9",
        "Đáp án test 43",
        "Giải thích test 43"
    ],
    [
        "Câu hỏi test 44 của bộ 9",
        "Đáp án test 44",
        "Giải thích test 44"
    ],
    [
        "Câu hỏi test 45 của bộ 9",
        "Đáp án test 45",
        "Giải thích test 45"
    ]
],
  'public_10': [
    [
        "Câu hỏi test 1 của bộ 10",
        "Đáp án test 1",
        "Giải thích test 1"
    ],
    [
        "Câu hỏi test 2 của bộ 10",
        "Đáp án test 2",
        "Giải thích test 2"
    ],
    [
        "Câu hỏi test 3 của bộ 10",
        "Đáp án test 3",
        "Giải thích test 3"
    ],
    [
        "Câu hỏi test 4 của bộ 10",
        "Đáp án test 4",
        "Giải thích test 4"
    ],
    [
        "Câu hỏi test 5 của bộ 10",
        "Đáp án test 5",
        "Giải thích test 5"
    ],
    [
        "Câu hỏi test 6 của bộ 10",
        "Đáp án test 6",
        "Giải thích test 6"
    ],
    [
        "Câu hỏi test 7 của bộ 10",
        "Đáp án test 7",
        "Giải thích test 7"
    ],
    [
        "Câu hỏi test 8 của bộ 10",
        "Đáp án test 8",
        "Giải thích test 8"
    ],
    [
        "Câu hỏi test 9 của bộ 10",
        "Đáp án test 9",
        "Giải thích test 9"
    ],
    [
        "Câu hỏi test 10 của bộ 10",
        "Đáp án test 10",
        "Giải thích test 10"
    ],
    [
        "Câu hỏi test 11 của bộ 10",
        "Đáp án test 11",
        "Giải thích test 11"
    ],
    [
        "Câu hỏi test 12 của bộ 10",
        "Đáp án test 12",
        "Giải thích test 12"
    ],
    [
        "Câu hỏi test 13 của bộ 10",
        "Đáp án test 13",
        "Giải thích test 13"
    ],
    [
        "Câu hỏi test 14 của bộ 10",
        "Đáp án test 14",
        "Giải thích test 14"
    ],
    [
        "Câu hỏi test 15 của bộ 10",
        "Đáp án test 15",
        "Giải thích test 15"
    ],
    [
        "Câu hỏi test 16 của bộ 10",
        "Đáp án test 16",
        "Giải thích test 16"
    ],
    [
        "Câu hỏi test 17 của bộ 10",
        "Đáp án test 17",
        "Giải thích test 17"
    ],
    [
        "Câu hỏi test 18 của bộ 10",
        "Đáp án test 18",
        "Giải thích test 18"
    ],
    [
        "Câu hỏi test 19 của bộ 10",
        "Đáp án test 19",
        "Giải thích test 19"
    ],
    [
        "Câu hỏi test 20 của bộ 10",
        "Đáp án test 20",
        "Giải thích test 20"
    ],
    [
        "Câu hỏi test 21 của bộ 10",
        "Đáp án test 21",
        "Giải thích test 21"
    ],
    [
        "Câu hỏi test 22 của bộ 10",
        "Đáp án test 22",
        "Giải thích test 22"
    ],
    [
        "Câu hỏi test 23 của bộ 10",
        "Đáp án test 23",
        "Giải thích test 23"
    ],
    [
        "Câu hỏi test 24 của bộ 10",
        "Đáp án test 24",
        "Giải thích test 24"
    ],
    [
        "Câu hỏi test 25 của bộ 10",
        "Đáp án test 25",
        "Giải thích test 25"
    ],
    [
        "Câu hỏi test 26 của bộ 10",
        "Đáp án test 26",
        "Giải thích test 26"
    ],
    [
        "Câu hỏi test 27 của bộ 10",
        "Đáp án test 27",
        "Giải thích test 27"
    ],
    [
        "Câu hỏi test 28 của bộ 10",
        "Đáp án test 28",
        "Giải thích test 28"
    ],
    [
        "Câu hỏi test 29 của bộ 10",
        "Đáp án test 29",
        "Giải thích test 29"
    ],
    [
        "Câu hỏi test 30 của bộ 10",
        "Đáp án test 30",
        "Giải thích test 30"
    ],
    [
        "Câu hỏi test 31 của bộ 10",
        "Đáp án test 31",
        "Giải thích test 31"
    ],
    [
        "Câu hỏi test 32 của bộ 10",
        "Đáp án test 32",
        "Giải thích test 32"
    ],
    [
        "Câu hỏi test 33 của bộ 10",
        "Đáp án test 33",
        "Giải thích test 33"
    ],
    [
        "Câu hỏi test 34 của bộ 10",
        "Đáp án test 34",
        "Giải thích test 34"
    ],
    [
        "Câu hỏi test 35 của bộ 10",
        "Đáp án test 35",
        "Giải thích test 35"
    ],
    [
        "Câu hỏi test 36 của bộ 10",
        "Đáp án test 36",
        "Giải thích test 36"
    ],
    [
        "Câu hỏi test 37 của bộ 10",
        "Đáp án test 37",
        "Giải thích test 37"
    ],
    [
        "Câu hỏi test 38 của bộ 10",
        "Đáp án test 38",
        "Giải thích test 38"
    ],
    [
        "Câu hỏi test 39 của bộ 10",
        "Đáp án test 39",
        "Giải thích test 39"
    ],
    [
        "Câu hỏi test 40 của bộ 10",
        "Đáp án test 40",
        "Giải thích test 40"
    ],
    [
        "Câu hỏi test 41 của bộ 10",
        "Đáp án test 41",
        "Giải thích test 41"
    ],
    [
        "Câu hỏi test 42 của bộ 10",
        "Đáp án test 42",
        "Giải thích test 42"
    ],
    [
        "Câu hỏi test 43 của bộ 10",
        "Đáp án test 43",
        "Giải thích test 43"
    ],
    [
        "Câu hỏi test 44 của bộ 10",
        "Đáp án test 44",
        "Giải thích test 44"
    ],
    [
        "Câu hỏi test 45 của bộ 10",
        "Đáp án test 45",
        "Giải thích test 45"
    ]
]
};
