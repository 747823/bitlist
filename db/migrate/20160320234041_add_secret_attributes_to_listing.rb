class AddSecretAttributesToListing < ActiveRecord::Migration
  def change
    add_column :listings, :validated, :boolean
    add_column :listings, :secret_key, :string
  end
end
