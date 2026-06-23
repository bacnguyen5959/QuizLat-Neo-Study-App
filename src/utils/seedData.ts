import { useDeckStore } from '../store/deckStore';
import { useFlashcardStore } from '../store/flashcardStore';
import { useSrsStore } from '../store/srsStore';

export const seedMockData = () => {
  const { decks } = useDeckStore.getState();

  // Kiểm tra xem đã có bộ thẻ mock_deck_1 chưa (để tránh tạo trùng lặp mỗi khi mở app)
  // Nếu bạn muốn test dữ liệu mới, hãy xóa ứng dụng cài lại, hoặc chúng ta dùng logic đè dữ liệu.
  // Ở đây tôi sẽ tự động XÓA dữ liệu mock cũ và BƠM LẠI dữ liệu mock mới (20 thẻ/bộ).
  const oldDecks = decks.filter(d => !d.deckId.startsWith('mock_deck_'));
  const oldCards = useFlashcardStore.getState().cards.filter(c => !c.deckId.startsWith('mock_deck_'));
  const oldReviews = useSrsStore.getState().reviews.filter(r => !r.deckId.startsWith('mock_deck_'));

  const mockDecks = [
    { deckId: 'mock_deck_1', name: 'IELTS Vocabulary (Band 7.0)', description: 'Từ vựng cốt lõi cho IELTS', createdAt: Date.now() - 5000000 },
    { deckId: 'mock_deck_11', name: 'TOEIC 600 Essential Words', description: 'Từ vựng luyện thi TOEIC', createdAt: Date.now() - 4000000 },
    { deckId: 'mock_deck_3', name: 'HSK 1 Tiếng Trung', description: 'Dành cho người mới học tiếng Trung', createdAt: Date.now() - 3000000 },
    { deckId: 'mock_deck_4', name: 'Lịch sử Việt Nam', description: 'Các cột mốc quan trọng trong lịch sử VN', createdAt: Date.now() - 2500000 },
    { deckId: 'mock_deck_5', name: 'Khoa học quanh ta', description: 'Kiến thức khoa học thường thức', createdAt: Date.now() - 2000000 },
    { deckId: 'mock_deck_6', name: 'Lập trình Cơ bản (JS)', description: 'Các khái niệm Javascript cốt lõi', createdAt: Date.now() - 1500000 },
    { deckId: 'mock_deck_7', name: 'Địa lý Thế giới', description: 'Thủ đô và Châu lục', createdAt: Date.now() - 1000000 },
    { deckId: 'mock_deck_8', name: 'Công thức Toán học', description: 'Toán học cấp 2 & cấp 3', createdAt: Date.now() - 500000 },
    { deckId: 'mock_deck_9', name: 'Thuật ngữ Y khoa', description: 'Từ vựng y tế cơ bản', createdAt: Date.now() - 250000 },
    { deckId: 'mock_deck_10', name: 'Nghệ thuật Ẩm thực', description: 'Từ vựng tiếng Anh chủ đề Nấu ăn', createdAt: Date.now() - 100000 },
  ];

  const mockCards = [
    // 1. IELTS Vocabulary (20 cards)
    ...[
      ['Abundant', 'Dồi dào, phong phú', 'There is an abundant supply of food.'],
      ['Accomplish', 'Hoàn thành, đạt được', 'She accomplished her goals.'],
      ['Adequate', 'Đầy đủ, tương xứng', 'The room is adequate for our needs.'],
      ['Aggressive', 'Hung hăng, quyết đoán', 'He is an aggressive player.'],
      ['Ambitious', 'Tham vọng', 'She is an ambitious young lawyer.'],
      ['Apparent', 'Rõ ràng, hiển nhiên', 'It was apparent that he was lying.'],
      ['Approximate', 'Xấp xỉ', 'The approximate cost is $50.'],
      ['Attitude', 'Thái độ', 'He has a positive attitude.'],
      ['Attribute', 'Đặc tính, thuộc tính', 'Patience is an important attribute.'],
      ['Authentic', 'Đích thực, chính gốc', 'This is an authentic Italian recipe.'],
      ['Benefit', 'Lợi ích', 'There are many financial benefits.'],
      ['Bias', 'Thiên vị, thành kiến', 'He showed a strong bias towards the candidate.'],
      ['Brief', 'Ngắn gọn', 'Please keep your explanation brief.'],
      ['Capable', 'Có khả năng', 'She is capable of handling the project.'],
      ['Capacity', 'Sức chứa, năng lực', 'The stadium has a seating capacity of 50,000.'],
      ['Cease', 'Dừng lại, ngừng', 'The factory will cease operations next month.'],
      ['Cite', 'Trích dẫn', 'He cited several experts in his paper.'],
      ['Clarify', 'Làm rõ', 'Could you clarify your point?'],
      ['Coherent', 'Mạch lạc, chặt chẽ', 'Her argument was clear and coherent.'],
      ['Collapse', 'Sụp đổ', 'The building collapsed during the earthquake.'],
    ].map(c => ({ deckId: 'mock_deck_1', question: c[0], answer: c[1], example: c[2] })),

    // 2. TOEIC 600 Essential Words (40 cards)
    ...[
      ['Abide by', 'Tuân thủ', 'You have to abide by the rules of the company.'],
      ['Agreement', 'Hợp đồng, sự thỏa thuận', 'We reached an agreement after a long discussion.'],
      ['Assurance', 'Sự bảo đảm', 'He gave me his assurance that the product is safe.'],
      ['Cancel', 'Hủy bỏ', 'The meeting was canceled due to bad weather.'],
      ['Determine', 'Xác định, quyết định', 'We need to determine the cause of the problem.'],
      ['Engage', 'Tham gia, cam kết', 'We need to engage the customers.'],
      ['Establish', 'Thành lập', 'The company was established in 2005.'],
      ['Obligate', 'Bắt buộc', 'The contract obligates us to pay on time.'],
      ['Party', 'Bên (trong hợp đồng)', 'The two parties signed the contract.'],
      ['Provision', 'Điều khoản (hợp đồng)', 'According to the provisions of the agreement...'],
      ['Resolve', 'Giải quyết', 'We must resolve this issue immediately.'],
      ['Specific', 'Cụ thể', 'Can you be more specific?'],
      ['Attract', 'Thu hút', 'The new design will attract more customers.'],
      ['Compare', 'So sánh', 'If you compare the two products, ours is better.'],
      ['Competition', 'Sự cạnh tranh', 'There is fierce competition in the market.'],
      ['Consume', 'Tiêu thụ', 'This car consumes a lot of gas.'],
      ['Convince', 'Thuyết phục', 'He convinced me to buy the house.'],
      ['Currently', 'Hiện tại', 'We are currently working on a new project.'],
      ['Fad', 'Mốt nhất thời', 'That fashion was just a passing fad.'],
      ['Inspiration', 'Cảm hứng', 'Nature is his main source of inspiration.'],
      ['Market', 'Thị trường', 'The real estate market is booming.'],
      ['Persuasion', 'Sự thuyết phục', 'She used her powers of persuasion.'],
      ['Productive', 'Có năng suất', 'We had a highly productive meeting.'],
      ['Satisfaction', 'Sự hài lòng', 'Customer satisfaction is our top priority.'],
      ['Characteristic', 'Đặc điểm', 'What are the characteristics of a good leader?'],
      ['Consequence', 'Hậu quả', 'He must face the consequences of his actions.'],
      ['Consider', 'Xem xét', 'Please consider my application.'],
      ['Cover', 'Bao gồm, che phủ', 'The insurance covers accidental damage.'],
      ['Expiration', 'Sự hết hạn', 'Check the expiration date on the package.'],
      ['Frequently', 'Thường xuyên', 'I frequently visit this website.'],
      ['Imply', 'Ngụ ý', 'What does this message imply?'],
      ['Promise', 'Hứa hẹn', 'I promise to finish the work by Friday.'],
      ['Protect', 'Bảo vệ', 'Wear a helmet to protect your head.'],
      ['Reputation', 'Danh tiếng', 'The company has a good reputation.'],
      ['Require', 'Yêu cầu', 'The job requires excellent communication skills.'],
      ['Variety', 'Sự đa dạng', 'We offer a wide variety of products.'],
      ['Address', 'Giải quyết (vấn đề)', 'We need to address this issue immediately.'],
      ['Avoid', 'Tránh', 'You should avoid eating too much sugar.'],
      ['Demonstrate', 'Chứng minh, minh họa', 'Let me demonstrate how this machine works.'],
      ['Develop', 'Phát triển', 'We are developing a new software.']
    ].map(c => ({ deckId: 'mock_deck_11', question: c[0], answer: c[1], example: c[2] })),

    // 3. HSK 1 (20 cards)
    ...[
      ['Nǐ (你)', 'Bạn', 'Nǐ hǎo!'],
      ['Hǎo (好)', 'Tốt, khỏe', 'Wǒ hěn hǎo.'],
      ['Wǒ (我)', 'Tôi', 'Wǒ shì xuéshēng.'],
      ['Míngzi (名字)', 'Tên', 'Nǐ jiào shénme míngzi?'],
      ['Shì (是)', 'Là', 'Tā shì lǎoshī.'],
      ['Zàijiàn (再见)', 'Tạm biệt', 'Zàijiàn!'],
      ['Rén (人)', 'Người', 'Tā shì Zhōngguó rén.'],
      ['Yī (一)', 'Một', 'Yī gè rén.'],
      ['Dà (大)', 'To, lớn', 'Zhè ge hěn dà.'],
      ['Chī (吃)', 'Ăn', 'Wǒ chī fàn.'],
      ['Hē (喝)', 'Uống', 'Wǒ hē shuǐ.'],
      ['Qù (去)', 'Đi', 'Wǒ qù xuéxiào.'],
      ['Lái (来)', 'Đến', 'Tā míngtiān lái.'],
      ['Xuéxiào (学校)', 'Trường học', 'Zhè shì wǒ de xuéxiào.'],
      ['Lǎoshī (老师)', 'Giáo viên', 'Tā shì wǒ de lǎoshī.'],
      ['Xuéshēng (学生)', 'Học sinh', 'Wǒmen shì xuéshēng.'],
      ['Māo (猫)', 'Con mèo', 'Zhè shì yī zhī māo.'],
      ['Gǒu (狗)', 'Con chó', 'Nà shì wǒ de gǒu.'],
      ['Zhè (这)', 'Đây, này', 'Zhè shì shénme?'],
      ['Nà (那)', 'Kia, đó', 'Nà shì wǒ de shū.'],
    ].map(c => ({ deckId: 'mock_deck_3', question: c[0], answer: c[1], example: c[2] })),

    // 4. Lịch sử VN (20 cards)
    ...[
      ['Năm 1945 là năm diễn ra sự kiện lịch sử vĩ đại nào của dân tộc Việt Nam?', 'Cách mạng tháng Tám thành công', 'Ngày 2/9/1945 Bác Hồ đọc Tuyên ngôn Độc lập khai sinh ra nước VNDCCH.'],
      ['Chiến thắng lịch sử nào vào năm 1954 đã lừng lẫy năm châu, chấn động địa cầu?', 'Chiến thắng Điện Biên Phủ', 'Đánh dấu sự kết thúc của kháng chiến chống Pháp.'],
      ['Sự kiện nào vào ngày 30/4/1975 đã thống nhất đất nước Việt Nam?', 'Giải phóng miền Nam', 'Xe tăng tiến vào Dinh Độc Lập lúc 11h30.'],
      ['Năm 938, Ngô Quyền đã đánh bại quân Nam Hán trên dòng sông nào?', 'Sông Bạch Đằng', 'Chấm dứt hơn 1000 năm Bắc thuộc.'],
      ['Năm 1010, vua Lý Công Uẩn đã quyết định dời đô từ Hoa Lư về đâu?', 'Thăng Long (Hà Nội)', 'Khởi đầu cho sự phát triển rực rỡ của Đại Việt.'],
      ['Cuộc khởi nghĩa Lam Sơn (1427) do ai lãnh đạo để đánh đuổi quân Minh?', 'Lê Lợi', 'Sau khi thắng lợi, Lê Lợi lên ngôi vua lập ra nhà Lê sơ.'],
      ['Chiến thắng Ngọc Hồi - Đống Đa năm 1789 gắn liền với vị hoàng đế nào?', 'Quang Trung (Nguyễn Huệ)', 'Đại phá 29 vạn quân Thanh vào đúng dịp Tết Kỷ Dậu.'],
      ['Năm 1858, thực dân Pháp đã nổ súng xâm lược Việt Nam lần đầu tại đâu?', 'Bán đảo Sơn Trà (Đà Nẵng)', 'Khởi đầu cho thời kỳ Pháp thuộc kéo dài gần 1 thế kỷ.'],
      ['Năm 40 sau Công Nguyên, cuộc khởi nghĩa nào đã nổ ra chống lại Thái thú Tô Định?', 'Khởi nghĩa Hai Bà Trưng', 'Cưỡi voi ra trận đánh đuổi quân Đông Hán.'],
      ['Bà Triệu phất cờ khởi nghĩa vào năm 248 để chống lại quân xâm lược nào?', 'Quân Ngô', '"Tôi muốn cưỡi cơn gió mạnh, đạp luồng sóng dữ...".'],
      ['Năm 544, Lý Bí lên ngôi và đặt tên nước ta là gì?', 'Vạn Xuân', 'Đóng đô ở vùng cửa sông Tô Lịch (Hà Nội ngày nay).'],
      ['Ai là người lãnh đạo quân dân Đại Cồ Việt đánh bại quân Tống năm 981?', 'Lê Hoàn (Lê Đại Hành)', 'Chiến thắng vang dội trên sông Bạch Đằng và ải Chi Lăng.'],
      ['Bài thơ "Nam quốc sơn hà" xuất hiện trong trận chiến chống quân Tống năm 1077 do ai lãnh đạo?', 'Lý Thường Kiệt', 'Được coi là bản Tuyên ngôn độc lập đầu tiên của Việt Nam.'],
      ['Quân và dân nhà Trần đã 3 lần đánh bại đội quân xâm lược hùng mạnh nào?', 'Quân Nguyên Mông', 'Đỉnh cao là chiến thắng Bạch Đằng năm 1288.'],
      ['Năm 1400, Hồ Quý Ly lên ngôi và đổi tên nước từ Đại Việt thành gì?', 'Đại Ngu', 'Tuy nhiên nhà Hồ chỉ tồn tại được một thời gian ngắn.'],
      ['Vương triều phong kiến cuối cùng của Việt Nam được thành lập năm 1802 là vương triều nào?', 'Nhà Nguyễn', 'Nguyễn Ánh lên ngôi, lấy niên hiệu là Gia Long.'],
      ['Đảng Cộng sản Việt Nam được thành lập vào ngày 3/2/1930 tại đâu?', 'Cửu Long (Hương Cảng, Trung Quốc)', 'Do Nguyễn Ái Quốc chủ trì hội nghị hợp nhất.'],
      ['Hiệp định nào được ký kết năm 1973 buộc Hoa Kỳ phải rút quân khỏi Việt Nam?', 'Hiệp định Paris', 'Đánh dấu thắng lợi to lớn về mặt ngoại giao.'],
      ['Năm 1986, Đại hội Đảng lần thứ VI đã đề ra đường lối quan trọng nào cho đất nước?', 'Công cuộc Đổi mới (Đổi mới kinh tế)', 'Chuyển sang nền kinh tế thị trường định hướng XHCN.'],
      ['Năm 1995 đánh dấu bước ngoặt quan trọng nào trong quan hệ ngoại giao của Việt Nam?', 'Bình thường hóa quan hệ Việt - Mỹ', 'Tổng thống Bill Clinton công bố quyết định này.']
    ].map(c => ({ deckId: 'mock_deck_4', question: c[0], answer: c[1], example: c[2] })),

    // 5. Khoa học quanh ta (20 cards)
    ...[
      ['Quá trình thực vật sử dụng ánh sáng mặt trời để tạo ra năng lượng và thải ra khí O2 gọi là gì?', 'Quá trình quang hợp', 'Giúp điều hòa lượng CO2 và O2 trong không khí.'],
      ['Lực vô hình nào giữ cho Trái Đất quay quanh Mặt Trời và giữ chúng ta không trôi nổi trong không gian?', 'Lực hấp dẫn', 'Được Isaac Newton khám phá khi thấy quả táo rơi.'],
      ['Hạt cơ bản nhất cấu tạo nên mọi vật chất trong vũ trụ được gọi là gì?', 'Nguyên tử', 'Bên trong nguyên tử có hạt nhân (proton, neutron) và electron.'],
      ['Công thức hóa học của Nước, một chất vô cùng quan trọng cho sự sống là gì?', 'H2O', 'Bao gồm 2 nguyên tử Hydro và 1 nguyên tử Oxy.'],
      ['Khí nào là nguyên nhân chính gây ra hiệu ứng nhà kính và sự nóng lên toàn cầu?', 'Carbon dioxide (CO2)', 'Được sinh ra nhiều từ việc đốt cháy nhiên liệu hóa thạch.'],
      ['Phân tử nào mang thông tin di truyền, quyết định các đặc điểm sinh học của sinh vật?', 'ADN (Acid Deoxyribonucleic)', 'Có cấu trúc chuỗi xoắn kép đặc trưng.'],
      ['Đơn vị cấu tạo cơ bản và nhỏ nhất của mọi sinh vật sống là gì?', 'Tế bào', 'Cơ thể con người được cấu tạo từ hàng nghìn tỷ tế bào.'],
      ['Loại vi sinh vật đơn bào nào có thể gây bệnh nhưng cũng có loại rất có lợi cho tiêu hóa?', 'Vi khuẩn (Bacteria)', 'Thuốc kháng sinh được dùng để tiêu diệt vi khuẩn.'],
      ['Tác nhân truyền nhiễm siêu nhỏ nào bắt buộc phải ký sinh bên trong tế bào vật chủ để nhân lên?', 'Virus', 'Ví dụ như virus SARS-CoV-2 gây ra đại dịch COVID-19.'],
      ['Vùng không-thời gian trong vũ trụ có lực hấp dẫn mạnh đến mức ánh sáng cũng không thoát ra được gọi là gì?', 'Lỗ đen (Black Hole)', 'Được hình thành khi một ngôi sao khổng lồ chết đi.'],
      ['Trái Đất là hành tinh thứ mấy tính từ Mặt Trời trong Hệ Mặt Trời?', 'Hành tinh thứ 3', 'Là nơi duy nhất cho đến nay được biết là có sự sống.'],
      ['Hệ thống gồm Mặt Trời và các thiên thể (như 8 hành tinh) quay xung quanh nó gọi là gì?', 'Hệ Mặt Trời (Solar System)', 'Nằm trong thiên hà Milky Way.'],
      ['Hành tinh nào trong Hệ Mặt Trời có bề mặt màu đỏ do chứa nhiều oxit sắt và được gọi là Hành tinh Đỏ?', 'Sao Hỏa (Mars)', 'Là mục tiêu khám phá tiếp theo của con người.'],
      ['Trong vũ trụ, tốc độ tuyệt đối nhanh nhất (khoảng 300.000 km/s) là tốc độ của cái gì?', 'Vận tốc ánh sáng', 'Ánh sáng từ Mặt Trời mất khoảng 8 phút để đến Trái Đất.'],
      ['Năng lượng mà một vật có được do chuyển động của nó được gọi là gì?', 'Động năng', 'Ví dụ: Chiếc xe đang chạy có động năng rất lớn.'],
      ['Năng lượng dự trữ của một vật ở một độ cao nhất định so với mặt đất được gọi là gì?', 'Thế năng hấp dẫn', 'Nước trên đập thủy điện có thế năng lớn để phát điện.'],
      ['Ở điều kiện áp suất khí quyển tiêu chuẩn, nước nguyên chất sẽ sôi ở bao nhiêu độ C?', '100°C', 'Khi sôi, nước chuyển từ thể lỏng sang thể khí.'],
      ['Bảng hệ thống phân loại tất cả các nguyên tố hóa học do nhà khoa học Mendeleev tạo ra gọi là gì?', 'Bảng tuần hoàn các nguyên tố hóa học', 'Sắp xếp theo thứ tự số hiệu nguyên tử tăng dần.'],
      ['Loại khí nào chiếm khoảng 21% trong bầu khí quyển và rất cần thiết cho sự hô hấp của con người?', 'Khí Oxi (O2)', 'Hô hấp là quá trình lấy Oxi và thải ra CO2.'],
      ['Khí nào chiếm tỷ lệ lớn nhất (khoảng 78%) trong thành phần của không khí trên Trái Đất?', 'Khí Nito (N2)', 'Rất quan trọng cho sự phát triển của thực vật.']
    ].map(c => ({ deckId: 'mock_deck_5', question: c[0], answer: c[1], example: c[2] })),

    // 6. Lập trình Cơ bản (JS) (20 cards)
    ...[
      ['Closure', 'Hàm ghi nhớ môi trường lexical của nó', 'Được dùng để tạo private variables.'],
      ['Promise', 'Đại diện cho một thao tác bất đồng bộ', 'Có 3 trạng thái: pending, fulfilled, rejected.'],
      ['Arrow Function', 'Cú pháp viết hàm ngắn gọn', 'Không có con trỏ `this` riêng.'],
      ['Array.map()', 'Tạo mảng mới từ mảng cũ', 'Thực thi một hàm lên từng phần tử.'],
      ['JSON', 'Định dạng dữ liệu', 'JavaScript Object Notation.'],
      ['Hoisting', 'Đưa khai báo biến/hàm lên đầu scope', 'Biến var được đưa lên đầu với giá trị undefined.'],
      ['Event Loop', 'Cơ chế xử lý bất đồng bộ', 'Quản lý Call Stack và Callback Queue.'],
      ['DOM', 'Document Object Model', 'Đại diện cấu trúc trang web thành cây đối tượng.'],
      ['Callback', 'Hàm được truyền vào hàm khác làm tham số', 'Thực thi sau khi tác vụ hoàn thành.'],
      ['Async/Await', 'Cú pháp viết code bất đồng bộ dễ đọc', 'Xây dựng trên nền tảng Promise.'],
      ['Var/Let/Const', 'Cách khai báo biến', 'let và const có block scope.'],
      ['Spread Operator', 'Cú pháp ba chấm (...)', 'Mở rộng iterable (như mảng, chuỗi) thành các phần tử riêng lẻ.'],
      ['Destructuring', 'Kỹ thuật giải nén dữ liệu', 'Trích xuất giá trị từ Object hoặc Mảng vào biến.'],
      ['Prototype', 'Cơ chế kế thừa trong JS', 'Mọi object đều có một thuộc tính nội bộ chỉ đến prototype của nó.'],
      ['TypeScript', 'Superset của JavaScript', 'Bổ sung static typing cho JS.'],
      ['Node.js', 'Môi trường chạy JS ngoài trình duyệt', 'Dùng engine V8 của Chrome.'],
      ['NPM', 'Node Package Manager', 'Quản lý các thư viện và gói của Node.'],
      ['React', 'Thư viện UI', 'Phát triển bởi Facebook.'],
      ['Component', 'Thành phần UI độc lập', 'Có thể tái sử dụng.'],
      ['State', 'Trạng thái nội bộ của Component', 'Gây ra re-render khi bị thay đổi.'],
    ].map(c => ({ deckId: 'mock_deck_6', question: c[0], answer: c[1], example: c[2] })),

    // 7. Địa lý Thế giới (20 cards)
    ...[
      ['Tokyo', 'Thủ đô của Nhật Bản', 'Thành phố đông dân nhất thế giới.'],
      ['Everest', 'Đỉnh núi cao nhất thế giới', 'Nằm trên dãy Himalaya.'],
      ['Amazon', 'Rừng nhiệt đới lớn nhất', 'Nằm ở Nam Mỹ, được ví là lá phổi xanh.'],
      ['Nile', 'Con sông dài nhất thế giới', 'Chảy qua Ai Cập.'],
      ['Nam Cực', 'Châu lục lạnh nhất', 'Không có quốc gia nào sở hữu hoàn toàn.'],
      ['Thái Bình Dương', 'Đại dương lớn nhất', 'Chiếm khoảng 1/3 diện tích Trái Đất.'],
      ['Châu Á', 'Châu lục lớn nhất', 'Đông dân nhất thế giới.'],
      ['Châu Phi', 'Châu lục nóng nhất', 'Nơi có sa mạc Sahara.'],
      ['Sahara', 'Sa mạc nóng lớn nhất thế giới', 'Nằm ở Bắc Phi.'],
      ['Paris', 'Thủ đô nước Pháp', 'Có tháp Eiffel nổi tiếng.'],
      ['London', 'Thủ đô nước Anh', 'Có đồng hồ Big Ben.'],
      ['New York', 'Thành phố đông dân nhất nước Mỹ', 'Có tượng Nữ thần Tự do.'],
      ['Moscow', 'Thủ đô nước Nga', 'Có Quảng trường Đỏ.'],
      ['Vạn Lý Trường Thành', 'Công trình kiến trúc vĩ đại ở Trung Quốc', 'Dài hàng vạn dặm.'],
      ['Dãy Alps', 'Dãy núi dài nhất châu Âu', 'Trải dài qua nhiều quốc gia.'],
      ['Dãy Himalaya', 'Hệ thống núi cao nhất thế giới', 'Ngăn cách lục địa Ấn Độ và Tây Tạng.'],
      ['Biển Đen', 'Vùng biển nằm giữa Đông Nam Âu và Tây Á', 'Nước có màu sẫm.'],
      ['Madagascar', 'Đảo quốc lớn thứ 4 thế giới', 'Nằm ở châu Phi.'],
      ['Kênh đào Suez', 'Nối biển Đỏ và Địa Trung Hải', 'Rút ngắn tuyến đường biển Âu-Á.'],
      ['Kênh đào Panama', 'Nối Thái Bình Dương và Đại Tây Dương', 'Cắt ngang eo đất Panama.'],
    ].map(c => ({ deckId: 'mock_deck_7', question: c[0], answer: c[1], example: c[2] })),

    // 8. Toán học (20 cards)
    ...[
      ['S (Hình tròn)', 'S = π * R^2', 'Diện tích hình tròn bán kính R.'],
      ['P (Hình chữ nhật)', 'P = (a + b) * 2', 'Chu vi hình chữ nhật.'],
      ['Định lý Pytago', 'a^2 + b^2 = c^2', 'Áp dụng cho tam giác vuông.'],
      ['Đạo hàm x^n', 'n * x^(n-1)', 'Quy tắc tính đạo hàm cơ bản.'],
      ['Sin(30°)', '1/2', 'Giá trị lượng giác.'],
      ['Cos(60°)', '1/2', 'Cùng giá trị với Sin(30°).'],
      ['Tan(45°)', '1', 'Sin(45°) / Cos(45°).'],
      ['S (Tam giác)', '1/2 * đáy * chiều cao', 'Diện tích tam giác cơ bản.'],
      ['V (Hình cầu)', '4/3 * π * R^3', 'Thể tích khối cầu.'],
      ['V (Hình nón)', '1/3 * π * R^2 * h', 'Thể tích khối nón.'],
      ['V (Hình trụ)', 'π * R^2 * h', 'Thể tích hình trụ tròn.'],
      ['Phương trình bậc 2', 'ax^2 + bx + c = 0', 'Giải bằng tính Delta.'],
      ['Delta (Δ)', 'b^2 - 4ac', 'Dùng để xét nghiệm của PT bậc 2.'],
      ['Cấp số cộng', 'u(n) = u(1) + (n-1)*d', 'Dãy số có khoảng cách đều (công sai).'],
      ['Cấp số nhân', 'u(n) = u(1) * q^(n-1)', 'Dãy số có tỷ lệ đều (công bội).'],
      ['Logarit', 'log_a(b) = c', 'Nghĩa là a^c = b.'],
      ['Tích phân', 'Ngược lại của đạo hàm', 'Dùng để tính diện tích hình phẳng.'],
      ['Giới hạn (Limit)', 'lim f(x) khi x tiến tới a', 'Giá trị mà hàm số tiếp cận.'],
      ['Đạo hàm Sin(x)', 'Cos(x)', 'Theo quy tắc lượng giác.'],
      ['Đạo hàm Cos(x)', '-Sin(x)', 'Chú ý dấu trừ.'],
    ].map(c => ({ deckId: 'mock_deck_8', question: c[0], answer: c[1], example: c[2] })),

    // 9. Y Khoa (20 cards)
    ...[
      ['Hypertension', 'Huyết áp cao', 'Cần điều chỉnh chế độ ăn uống.'],
      ['Diabetes', 'Bệnh tiểu đường', 'Liên quan đến lượng đường trong máu.'],
      ['Antibiotics', 'Thuốc kháng sinh', 'Dùng để tiêu diệt vi khuẩn.'],
      ['Vaccine', 'Vắc-xin', 'Kích thích hệ miễn dịch tạo kháng thể.'],
      ['Cardiology', 'Khoa tim mạch', 'Nghiên cứu và điều trị các bệnh về tim.'],
      ['Neurology', 'Khoa thần kinh', 'Điều trị bệnh về não và dây thần kinh.'],
      ['Oncology', 'Ung thư học', 'Nghiên cứu và điều trị khối u.'],
      ['Surgery', 'Phẫu thuật', 'Can thiệp y tế bằng dao kéo.'],
      ['Diagnosis', 'Chẩn đoán', 'Xác định bệnh dựa trên triệu chứng.'],
      ['Prescription', 'Đơn thuốc', 'Do bác sĩ kê cho bệnh nhân.'],
      ['Symptoms', 'Triệu chứng', 'Dấu hiệu của bệnh tật.'],
      ['Syndrome', 'Hội chứng', 'Tập hợp các triệu chứng xuất hiện cùng nhau.'],
      ['Chronic', 'Mãn tính', 'Bệnh kéo dài, khó chữa dứt điểm.'],
      ['Acute', 'Cấp tính', 'Phát bệnh nhanh và đột ngột.'],
      ['Virus', 'Vi-rút', 'Tác nhân gây bệnh siêu nhỏ.'],
      ['Bacteria', 'Vi khuẩn', 'Vi sinh vật đơn bào, có thể chữa bằng kháng sinh.'],
      ['Immune System', 'Hệ miễn dịch', 'Bảo vệ cơ thể khỏi tác nhân gây bệnh.'],
      ['Blood Pressure', 'Huyết áp', 'Áp lực máu tác động lên thành mạch.'],
      ['Heart Attack', 'Nhồi máu cơ tim', 'Tắc nghẽn mạch máu nuôi tim.'],
      ['Stroke', 'Đột quỵ', 'Chảy máu hoặc tắc nghẽn mạch máu não.'],
    ].map(c => ({ deckId: 'mock_deck_9', question: c[0], answer: c[1], example: c[2] })),

    // 10. Ẩm thực (20 cards)
    ...[
      ['Bake', 'Nướng (bằng lò)', 'Bake the cake for 30 minutes.'],
      ['Boil', 'Luộc, đun sôi', 'Boil the water.'],
      ['Fry', 'Chiên, rán', 'Fry the eggs.'],
      ['Grill', 'Nướng (trên vỉ)', 'Grill the meat.'],
      ['Steam', 'Hấp', 'Steam the vegetables.'],
      ['Roast', 'Quay, nướng (thịt)', 'Roast the chicken in the oven.'],
      ['Chop', 'Băm, thái nhỏ', 'Chop the onions.'],
      ['Slice', 'Thái lát', 'Slice the tomatoes.'],
      ['Dice', 'Thái hạt lựu', 'Dice the potatoes.'],
      ['Stir', 'Khuấy', 'Stir the soup constantly.'],
      ['Whisk', 'Đánh (trứng, kem)', 'Whisk the eggs until fluffy.'],
      ['Knead', 'Nhào bột', 'Knead the dough for 10 minutes.'],
      ['Marinate', 'Ướp', 'Marinate the beef with soy sauce.'],
      ['Peel', 'Gọt vỏ', 'Peel the apple.'],
      ['Grate', 'Bào sợi', 'Grate some cheese.'],
      ['Sauté', 'Áp chảo, xào nhanh', 'Sauté the garlic.'],
      ['Simmer', 'Ninh lửa nhỏ', 'Simmer the sauce for an hour.'],
      ['Poach', 'Chần (nước sôi lăn tăn)', 'Poach the egg.'],
      ['Blend', 'Xay nhuyễn', 'Blend the fruits to make a smoothie.'],
      ['Season', 'Nêm nếm gia vị', 'Season with salt and pepper.'],
    ].map(c => ({ deckId: 'mock_deck_10', question: c[0], answer: c[1], example: c[2] })),
  ];

  const newReviews: any[] = [];
  const newCards: any[] = [];

  // Chuẩn bị Cards và SRS
  mockCards.forEach((c, i) => {
    const cardId = `mock_card_${i}`;
    newCards.push({ ...c, cardId, createdAt: Date.now() });

    // Thuật toán giả lập đã review vài lần
    const isDue = i % 3 === 0;
    const interval = isDue ? 0 : Math.floor(Math.random() * 5) + 1; // 1-5 ngày
    
    newReviews.push({
      reviewId: `mock_review_${i}`,
      cardId,
      deckId: c.deckId,
      question: c.question,
      answer: c.answer,
      lastReviewed: Date.now() - 1000 * 60 * 60 * 24 * 2, // Cách đây 2 ngày
      ease: 2.5,
      interval: interval,
      nextReviewDate: isDue 
        ? Date.now() - 1000 * 60 * 60 * 24 // Quá hạn 1 ngày (để báo đỏ)
        : Date.now() + 1000 * 60 * 60 * 24 * interval // Chưa đến hạn
    });
  });

  // Ghi đè vào store (bao gồm cả dữ liệu người dùng cũ để không bị mất đồ tự tạo)
  useDeckStore.setState({ decks: [...oldDecks, ...(mockDecks as any)] });
  useFlashcardStore.setState({ cards: [...oldCards, ...newCards] });
  useSrsStore.setState({ reviews: [...oldReviews, ...newReviews] });
};
