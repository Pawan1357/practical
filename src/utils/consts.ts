enum Role {
  Supplier = 'Supplier',
}

export default Role;

// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export const emailRegex: RegExp = /^\w+([\.+]*?\w+[\+]*)@\w+(\w+)(\.\w{2,3})+$/;

// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export const passRegex: RegExp =
  /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

export const ERR_MSGS = {
  SUPPLIER_NOT_FOUND: 'Supplier not found!',
  EMAIL_ALREADY_USED:
    'Entered email is not available to use! Please use another!',
  EMAIL_NOT_LINKED:
    'Provided email is not linked with any account! Please enter a valid email!',
  BAD_CREDS: 'Bad Credentials!',
  PWD_DONT_MATCH: "Password's don't match!",
  LINK_EXPIRED: 'Password reset token is invalid or link has expired!',
  SESSION_EXPIRED: 'Session expired! Login again!',
  NO_CHANGE_DETECTED: 'No change detected!',
  PRODUCT_NOT_FOUND:
    'Product details not found! Either its deleted or incorrect search id provided!',
};

export const SUCCESS_MSGS = {
  SUPPLIER_DELETED: 'User Deleted!',
  PRODUCT_DELETED: 'Product deleted!',
  SUPPLIER_CREATED: 'Supplier created!',
  PRODUCT_CREATED: 'Product created!',
  LOGGED_IN: 'Supplier logged in successfully!',
  FIND_ALL_PRODUCTS: 'Found all products!',
  FOUND_ONE_PRODUCT: 'Found one product!',
  UPDATED_PRODUCT: 'Product updated successfully!',
  PWD_CHANGED: 'Password changed successfully!',
  MAIL_SENT: 'Please check your email for details to reset password!',
};

export const priceOptions = {
  type: Number,
  set: (v: number) => v * 100,
  get: (v: number) => (v / 100).toFixed(2),
};
