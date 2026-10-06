# Tài liệu API - WEB-2HAND-BE

## 1. Thông tin chung

- Framework: FastAPI
- API prefix: `/api/v1`
- Base URL khi chạy local: `http://localhost:8000`
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- Định dạng dữ liệu: JSON
- Header thường dùng:

```http
Content-Type: application/json
```

Các API yêu cầu đăng nhập cần thêm:

```http
Authorization: Bearer <access_token>
```

Các route `/`, `/health` không thuộc prefix `/api/v1`.

## 2. Quy ước xác thực

### Đăng ký hoặc đăng nhập

1. Gọi `POST /api/v1/auth/register` để tạo tài khoản.
2. Gọi `POST /api/v1/auth/login` để nhận `access_token`.
3. Gửi token trong header `Authorization` khi gọi API riêng tư.

Token là JWT. Thời gian hết hạn được cấu hình bởi `ACCESS_TOKEN_EXPIRE_MINUTES` trong phần cấu hình ứng dụng.

### Quyền người dùng

- User đã đăng nhập: các API có yêu cầu `Bearer token`.
- Seller hoặc Admin: được cập nhật trạng thái đơn hàng.
- Admin hoặc Seller: được xem chi tiết đơn hàng của người dùng khác.

## 3. API kiểm tra hệ thống

### GET `/`

Kiểm tra ứng dụng FastAPI có đang chạy hay không.

**Response `200 OK`:**

```json
{
  "message": "FastAPI đang chạy "
}
```

### GET `/health`

Kiểm tra trạng thái hệ thống.

**Response `200 OK`:**

```json
{
  "status": "ok"
}
```

## 4. API xác thực

### POST `/api/v1/auth/register`

Đăng ký tài khoản mới.

**Authentication:** Không cần.

**Request body:**

```json
{
  "full_name": "Nguyen Van A",
  "username": "nguyenvana",
  "email": "vana@example.com",
  "password": "123456",
  "phone_number": "0900000000"
}
```

| Trường | Kiểu | Bắt buộc | Mô tả |
|---|---|---:|---|
| `full_name` | string | Có | Họ và tên |
| `username` | string | Có | Tên đăng nhập |
| `email` | string/email | Có | Email hợp lệ |
| `password` | string | Có | Tối thiểu 6 ký tự |
| `phone_number` | string/null | Không | Số điện thoại |

**Response `201 Created`:**

```json
{
  "id": 1,
  "full_name": "Nguyen Van A",
  "username": "nguyenvana",
  "email": "vana@example.com",
  "phone_number": "0900000000",
  "role": "user",
  "created_at": "2026-09-15T10:00:00"
}
```

**Lỗi chính:**

- `400`: Email hoặc username đã tồn tại.
- `422`: Dữ liệu đầu vào không hợp lệ hoặc mật khẩu dưới 6 ký tự.

### POST `/api/v1/auth/login`

Đăng nhập bằng email hoặc username.

**Authentication:** Không cần.

**Request body:**

```json
{
  "identifier": "vana@example.com",
  "password": "123456"
}
```

| Trường | Kiểu | Bắt buộc | Mô tả |
|---|---|---:|---|
| `identifier` | string | Có | Email hoặc username |
| `password` | string | Có | Mật khẩu |

**Response `200 OK`:**

```json
{
  "access_token": "<jwt_token>",
  "token_type": "bearer"
}
```

**Lỗi chính:**

- `401`: Sai thông tin đăng nhập.
- `422`: Thiếu hoặc sai kiểu dữ liệu.

### GET `/api/v1/auth/me`

Lấy thông tin tài khoản hiện đang đăng nhập.

**Authentication:** Có.

**Response `200 OK`:** Trả về object người dùng giống response của API đăng ký.

**Lỗi chính:**

- `401`: Thiếu token, token không hợp lệ, token hết hạn hoặc tài khoản không tồn tại.

## 5. API danh mục và sản phẩm

### GET `/api/v1/categories`

Lấy danh sách danh mục chưa bị xóa mềm.

**Authentication:** Không cần.

**Response `200 OK`:**

```json
[
  {
    "id": 1,
    "parent_id": null,
    "name": "Điện tử",
    "description": "Đồ điện tử đã qua sử dụng",
    "created_at": "2026-09-15T10:00:00"
  }
]
```

### GET `/api/v1/products`

Lấy danh sách sản phẩm chưa bị xóa mềm.

**Authentication:** Không cần.

**Query parameters:**

| Tên | Kiểu | Mặc định | Mô tả |
|---|---|---:|---|
| `skip` | integer >= 0 | `0` | Số bản ghi bỏ qua |
| `limit` | integer 1-100 | `20` | Số bản ghi tối đa |
| `category_id` | integer/null | Không có | Lọc theo danh mục |
| `search` | string/null | Không có | Tìm gần đúng theo tên sản phẩm |

**Ví dụ:**

```http
GET /api/v1/products?skip=0&limit=20&category_id=1&search=iphone
```

**Response `200 OK`:**

```json
[
  {
    "id": 10,
    "name": "iPhone 13",
    "summary": "Máy đã qua sử dụng",
    "cover": "https://example.com/iphone13.jpg",
    "price": 12000000,
    "status": "available",
    "stock_quantity": 1,
    "category_id": 1
  }
]
```

### GET `/api/v1/products/{product_id}`

Lấy thông tin chi tiết một sản phẩm, gồm danh mục và danh sách hình ảnh.

**Authentication:** Không cần.

**Path parameter:** `product_id` - ID sản phẩm.

**Response `200 OK`:**

```json
{
  "id": 10,
  "name": "iPhone 13",
  "summary": "Máy đã qua sử dụng",
  "description": "Thông tin chi tiết sản phẩm",
  "cover": "https://example.com/iphone13.jpg",
  "price": 12000000,
  "condition_status": "used_good",
  "status": "available",
  "stock_quantity": 1,
  "created_at": "2026-09-15T10:00:00",
  "category": {
    "id": 1,
    "parent_id": null,
    "name": "Điện tử",
    "description": "Đồ điện tử đã qua sử dụng",
    "created_at": "2026-09-15T09:00:00"
  },
  "images": [
    {
      "id": 20,
      "image_url": "https://example.com/iphone13-back.jpg"
    }
  ]
}
```

**Lỗi chính:**

- `404`: Sản phẩm không tồn tại hoặc đã bị xóa mềm.

### POST `/api/v1/products`

Tạo sản phẩm mới cho người dùng đang đăng nhập.

**Authentication:** Có.

**Request body:**

```json
{
  "category_id": 1,
  "name": "iPhone 13",
  "summary": "Máy đã qua sử dụng",
  "description": "Thông tin chi tiết sản phẩm",
  "cover": "https://example.com/iphone13.jpg",
  "price": 12000000,
  "condition_status": "used_good",
  "status": "available",
  "stock_quantity": 1,
  "image_urls": [
    "https://example.com/iphone13-back.jpg"
  ]
}
```

| Trường | Kiểu | Bắt buộc | Mặc định / điều kiện |
|---|---|---:|---|
| `category_id` | integer/null | Không | Danh mục phải tồn tại nếu truyền |
| `name` | string | Có | Tên sản phẩm |
| `summary` | string/null | Không | Tóm tắt |
| `description` | string/null | Không | Mô tả chi tiết |
| `cover` | string/null | Không | URL ảnh đại diện |
| `price` | integer | Có | Phải lớn hơn 0 |
| `condition_status` | string/null | Không | Tình trạng sản phẩm |
| `status` | string/null | Không | `available` |
| `stock_quantity` | integer | Không | `0` |
| `image_urls` | array[string] | Không | `[]` |

**Response `201 Created`:** Trả về `ProductOut`, giống response chi tiết sản phẩm.

**Lỗi chính:**

- `400`: `category_id` không tồn tại.
- `401`: Chưa đăng nhập hoặc token không hợp lệ.
- `422`: Giá không lớn hơn 0 hoặc body không hợp lệ.

## 6. API giỏ hàng

Tất cả API trong phần này yêu cầu đăng nhập và chỉ thao tác trên giỏ hàng của người dùng hiện tại.

### GET `/api/v1/cart`

Lấy giỏ hàng hiện tại. Nếu chưa có giỏ hàng, hệ thống tự tạo giỏ rỗng.

**Response `200 OK`:**

```json
{
  "id": 5,
  "items": [
    {
      "id": 12,
      "quantity": 2,
      "product": {
        "id": 10,
        "name": "iPhone 13",
        "price": 12000000,
        "cover": "https://example.com/iphone13.jpg"
      }
    }
  ],
  "total": 24000000
}
```

### POST `/api/v1/cart/items`

Thêm sản phẩm vào giỏ. Nếu sản phẩm đã có trong giỏ, số lượng sẽ được cộng thêm.

**Request body:**

```json
{
  "product_id": 10,
  "quantity": 1
}
```

| Trường | Kiểu | Bắt buộc | Mặc định / điều kiện |
|---|---|---:|---|
| `product_id` | integer | Có | ID sản phẩm |
| `quantity` | integer | Không | `1`, phải lớn hơn 0 |

**Response `201 Created`:** Trả về toàn bộ `CartOut` sau khi thêm.

**Lỗi chính:**

- `400`: Số lượng vượt quá tồn kho.
- `401`: Chưa đăng nhập.
- `404`: Sản phẩm không tồn tại hoặc đã bị xóa mềm.

### PUT `/api/v1/cart/items/{item_id}`

Cập nhật số lượng của một item trong giỏ hàng hiện tại.

**Path parameter:** `item_id` - ID item trong giỏ.

**Request body:**

```json
{
  "quantity": 2
}
```

**Response `200 OK`:** Trả về `CartOut` sau khi cập nhật.

**Lỗi chính:**

- `400`: Số lượng vượt quá tồn kho.
- `404`: Item không tồn tại trong giỏ hàng hiện tại.

### DELETE `/api/v1/cart/items/{item_id}`

Xóa một item khỏi giỏ hàng hiện tại.

**Path parameter:** `item_id` - ID item trong giỏ.

**Response `200 OK`:** Trả về `CartOut` sau khi xóa.

**Lỗi chính:**

- `404`: Item không tồn tại trong giỏ hàng hiện tại.

### DELETE `/api/v1/cart`

Xóa toàn bộ item trong giỏ hàng hiện tại và đưa tổng tiền về `0`.

**Response `200 OK`:**

```json
{
  "id": 5,
  "items": [],
  "total": 0
}
```

## 7. API địa chỉ giao hàng

Tất cả API yêu cầu đăng nhập và chỉ trả về địa chỉ của người dùng hiện tại.

### POST `/api/v1/addresses`

Tạo địa chỉ giao hàng.

**Request body:**

```json
{
  "title": "Nhà riêng",
  "address_line": "123 Nguyễn Trãi",
  "city": "Hà Nội",
  "country": "Việt Nam",
  "phone_number": "0900000000"
}
```

| Trường | Kiểu | Bắt buộc | Mặc định |
|---|---|---:|---|
| `title` | string/null | Không | `null` |
| `address_line` | string | Có | - |
| `city` | string | Có | - |
| `country` | string/null | Không | `Việt Nam` |
| `phone_number` | string | Có | - |

**Response `201 Created`:**

```json
{
  "id": 3,
  "title": "Nhà riêng",
  "address_line": "123 Nguyễn Trãi",
  "city": "Hà Nội",
  "country": "Việt Nam",
  "phone_number": "0900000000"
}
```

### GET `/api/v1/addresses`

Lấy danh sách địa chỉ chưa bị xóa mềm của người dùng hiện tại.

**Response `200 OK`:** Trả về mảng `AddressOut`.

## 8. API đơn hàng và thanh toán

### POST `/api/v1/orders/checkout`

Tạo đơn hàng từ giỏ hàng hiện tại.

Quy trình thực hiện:

1. Kiểm tra giỏ hàng không rỗng.
2. Xác định địa chỉ giao hàng từ `address_id` hoặc tạo địa chỉ mới từ `new_address`.
3. Kiểm tra tồn kho.
4. Tạo đơn hàng và các item đơn hàng.
5. Trừ số lượng tồn kho.
6. Tạo thông tin thanh toán ở trạng thái `unpaid`.
7. Xóa các item khỏi giỏ hàng.

**Authentication:** Có.

**Request body dùng địa chỉ có sẵn:**

```json
{
  "address_id": 3,
  "payment_provider": "COD"
}
```

**Request body dùng địa chỉ mới:**

```json
{
  "new_address": {
    "title": "Văn phòng",
    "address_line": "456 Lê Lợi",
    "city": "Hồ Chí Minh",
    "country": "Việt Nam",
    "phone_number": "0911111111"
  },
  "payment_provider": "COD"
}
```

| Trường | Kiểu | Bắt buộc | Mô tả |
|---|---|---:|---|
| `address_id` | integer/null | Một trong hai | ID địa chỉ của chính người dùng |
| `new_address` | object/null | Một trong hai | Dữ liệu địa chỉ mới |
| `payment_provider` | string | Không | Mặc định `COD` |

Chỉ nên gửi một trong `address_id` hoặc `new_address`.

**Response `201 Created`:**

```json
{
  "id": 100,
  "total": 24000000,
  "status": "pending",
  "created_at": "2026-09-15T10:00:00",
  "address": {
    "id": 3,
    "title": "Nhà riêng",
    "address_line": "123 Nguyễn Trãi",
    "city": "Hà Nội",
    "country": "Việt Nam",
    "phone_number": "0900000000"
  },
  "items": [
    {
      "id": 50,
      "product_id": 10,
      "quantity": 2,
      "price_at_buy": 12000000
    }
  ],
  "payments": [
    {
      "id": 70,
      "amount": 24000000,
      "provider": "COD",
      "status": "unpaid",
      "qr_url": "<vietqr_url>"
    }
  ]
}
```

Khi payment có trạng thái `unpaid`, response tự sinh `qr_url` VietQR. Với trạng thái khác, `qr_url` là `null`.

**Lỗi chính:**

- `400`: Giỏ hàng trống.
- `400`: `address_id` không hợp lệ hoặc không thuộc người dùng hiện tại.
- `400`: Không cung cấp `address_id` và `new_address`.
- `400`: Sản phẩm không còn tồn tại hoặc không đủ tồn kho.
- `401`: Chưa đăng nhập.
- `500`: Lỗi không xác định trong quá trình đặt hàng.

### GET `/api/v1/orders`

Lấy danh sách đơn hàng của người dùng hiện tại.

**Authentication:** Có.

**Response `200 OK`:** Trả về mảng `OrderOut`. Mỗi đơn hàng bao gồm địa chỉ, item và payment.

### GET `/api/v1/orders/{order_id}`

Lấy chi tiết một đơn hàng.

**Authentication:** Có.

**Path parameter:** `order_id` - ID đơn hàng.

Người dùng chỉ xem được đơn của mình. Người dùng có role `admin` hoặc `seller` có thể xem đơn của người khác.

**Response `200 OK`:** Trả về một object `OrderOut`.

**Lỗi chính:**

- `401`: Chưa đăng nhập.
- `403`: Không có quyền xem đơn hàng.
- `404`: Đơn hàng không tồn tại.

### PUT `/api/v1/orders/{order_id}/status`

Cập nhật trạng thái đơn hàng.

**Authentication:** Có.

**Role yêu cầu:** `admin` hoặc `seller`.

**Path parameter:** `order_id` - ID đơn hàng.

**Request body:**

```json
{
  "status": "confirmed"
}
```

| Trường | Kiểu | Bắt buộc | Mô tả |
|---|---|---:|---|
| `status` | string | Có | Trạng thái mới; backend hiện nhận chuỗi tự do |

**Response `200 OK`:** Trả về `OrderOut` sau khi cập nhật.

**Lỗi chính:**

- `401`: Chưa đăng nhập hoặc token không hợp lệ.
- `403`: Người dùng không có role `admin` hoặc `seller`.
- `404`: Đơn hàng không tồn tại.

## 9. Các model response chính

### UserOut

```json
{
  "id": 1,
  "full_name": "Nguyen Van A",
  "username": "nguyenvana",
  "email": "vana@example.com",
  "phone_number": "0900000000",
  "role": "user",
  "created_at": "2026-09-15T10:00:00"
}
```

### ProductListItem

Gồm: `id`, `name`, `summary`, `cover`, `price`, `status`, `stock_quantity`, `category_id`.

### ProductOut

Gồm: thông tin sản phẩm, `category` và mảng `images`.

### CartOut

Gồm:

- `id`: ID giỏ hàng.
- `items`: các sản phẩm trong giỏ.
- `total`: tổng tiền hiện tại.

### OrderOut

Gồm:

- `id`: ID đơn hàng.
- `total`: tổng tiền.
- `status`: trạng thái đơn.
- `created_at`: thời gian tạo.
- `address`: địa chỉ giao hàng.
- `items`: danh sách sản phẩm đã đặt và giá tại thời điểm mua.
- `payments`: thông tin thanh toán và QR nếu chưa thanh toán.

## 10. Mã lỗi thường gặp

| HTTP status | Ý nghĩa |
|---:|---|
| `400` | Dữ liệu hợp lệ về kiểu nhưng không hợp lệ về nghiệp vụ |
| `401` | Chưa xác thực hoặc token không hợp lệ |
| `403` | Đã xác thực nhưng không đủ quyền |
| `404` | Không tìm thấy tài nguyên |
| `422` | FastAPI/Pydantic từ chối dữ liệu đầu vào |
| `500` | Lỗi máy chủ trong quá trình xử lý |

Response lỗi FastAPI thường có dạng:

```json
{
  "detail": "Nội dung lỗi"
}
```

## 11. Ghi chú về trạng thái hiện tại của code

- Router API được đăng ký trong `app/api/v1/api.py` và được gắn prefix `/api/v1` tại `app/main.py`.
- CORS hiện cho phép mọi origin (`allow_origins=["*"]`), phù hợp phát triển local nhưng nên giới hạn lại khi deploy production.
- `ProductUpdate` đã được định nghĩa và import trong endpoint sản phẩm nhưng hiện chưa có route `PUT/PATCH` cập nhật sản phẩm.
- Chưa thấy route tạo hoặc quản lý category trong các router hiện tại; API category hiện chỉ có lấy danh sách.
- Chưa thấy route cập nhật/xóa địa chỉ.
- Trạng thái đơn hàng hiện nhận chuỗi tự do, chưa có enum validation trong schema.
- API checkout tạo payment ở trạng thái `unpaid`; tài liệu QR được tạo từ số tiền thanh toán và ID đơn hàng.
