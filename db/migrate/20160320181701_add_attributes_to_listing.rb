class AddAttributesToListing < ActiveRecord::Migration
  def change
    add_column :listings, :title, :string
    add_column :listings, :author, :string
    add_column :listings, :email, :string
    add_column :listings, :zipcode, :integer
    add_column :listings, :address, :string
    add_column :listings, :price, :float
    add_column :listings, :currency, :string
    add_column :listings, :condition, :string
    add_column :listings, :description, :text
  end
end
