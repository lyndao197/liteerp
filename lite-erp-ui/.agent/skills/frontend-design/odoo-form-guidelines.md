# Odoo Form UI Guidelines

These guidelines define the standard UI layout and CSS class naming conventions for modern form pages in the Lite ERP system. This pattern should be consistently applied to all "Create/Edit" pages (e.g., Customer, Product, Order, etc.) to ensure a uniform User Experience.

## 1. Overall Page Structure

All form pages should follow this standard wrapper and header structure:

```jsx
<div className="customer-form-modern">
  <div className="customer-form-header">
    <div className="breadcrumb">
      <span className="breadcrumb-item" onClick={...}>Quản lý khách hàng</span>
      <span className="breadcrumb-item">/</span>
      <span className="breadcrumb-current">Thêm Mới KH</span>
    </div>
    <div className="header-actions">
      <button className="btn btn-secondary"><ArrowLeft size={16} /> Quay lại</button>
      <button className="btn btn-primary"><Save size={16} /> Lưu hồ sơ</button>
    </div>
  </div>

  <div className="form-body-wrapper">
    {/* Page Content Goes Here */}
  </div>
</div>
```

### Key Classes:
* `.customer-form-modern`: Page background (`#f9f9f9`), defines min-height and font.
* `.customer-form-header`: Sticky header (`white`), provides breadcrumbs and action buttons.
* `.form-body-wrapper`: Main container (`padding: 32px; max-width: 1200px; margin: 0 auto;`).

## 2. Sections and Form Cards

Content inside `.form-body-wrapper` is grouped into sections containing titles and cards.

```jsx
<div className="section-header">
  <h2 className="section-title">Thông tin chung</h2>
  {/* Optional Badges */}
  <div className="badge-opportunity">Nhãn trạng thái</div> 
</div>

<div className="form-card">
  {/* Form Rows Go Here */}
</div>
```

### Key Classes:
* `.section-header`: Flex container with justify-between and margin-bottom.
* `.section-title`: Large header text (`24px`, `#0f172a`, bold).
* `.form-card`: White box with rounded corners (`border-radius: 8px`), border (`#e2e8f0`), and padding (`24px`).

## 3. Form Rows and Inputs

Inside a `.form-card`, data inputs are organized into identical rows.

```jsx
<div className="form-row-modern">
  {/* Label */}
  <div className="form-label-modern">
    <span>Tên trường</span> 
    <span className="asterisk">*</span> {/* Optional: For required fields */}
  </div>
  
  {/* Input Value Area */}
  <div className="form-value-modern">
    <input 
      type="text" 
      className={`input-modern ${isError ? 'is-invalid' : ''}`} 
      placeholder="Nhập dữ liệu..." 
    />
  </div>
</div>
```

If a row has tall content (like an address grid), add `.align-start`:
`<div className="form-row-modern align-start">`

### Input Types and Classes:
* **Text Input**: `<input className="input-modern" />` (Borderless base input, full width).
* **Select Dropdown**: `<select className="select-modern" />` (Light gray `#eff0f1` base background).
* **Radio Group**:
  ```jsx
  <div className="radio-group-modern">
    <label className="radio-label-modern">
      <input type="radio" /> Lựa chọn 1
    </label>
  </div>
  ```
* **Validation**: Add `.is-invalid` to `.input-modern` or `.select-modern` to trigger the red error border (`#ef4444`).

## 4. Tables and Grids within Forms

For lists like Contacts, Contracts, or Documents grouped inside a form:

```jsx
<div className="table-card">
  <div className="table-header my-custom-grid-class">
    <span>STT</span>
    <span>Cột 1</span>
    <span>Cột 2</span>
  </div>
  
  <div className="table-row my-custom-grid-class">
    <span>01</span>
    <span className="text-link">Giá trị có thể click</span>
    <span className="text-action">Hành động</span>
  </div>
</div>
```

### Key Classes:
* **`.table-card`**: Wrapper for tables (White background, border, border-radius, overflow-hidden).
* **`.table-header`**: Header row (Bold text, specific background).
* **`.table-row`**: Data row (`#fafafa` background, hover effect with `#f1f5f9`).
* **Grid Classes**: Use additional CSS classes (like `.my-custom-grid-class`) defining `display: grid; grid-template-columns: ...` on both header and rows to align columns identically.
* **Inline Inputs in Tables**: For adding/editing directly in rows, use `<input className="table-row-input" />`.
* **Action Texts**: `.text-link` (blue, hover underline) and `.text-action` (red primary action, bold).

## 5. Main Theme Settings
When porting controls or writing inline styles, adhere to these key colors:
* **Primary (Red)**: `#ed0029` (Buttons, active states).
* **Secondary Action**: `#0073e8` (Links).
* **Body Text**: `#0f172a` (Very Dark Slate).
* **Muted Text (Labels/Hint)**: `#64748b` or `#81878f`.
* **Borders and Lines**: `#e2e8f0` or `#f1f5f9`.
* **Card/Panel Backgrounds**: `white`. 
* **App Canvas Background**: `#f9f9f9`.
