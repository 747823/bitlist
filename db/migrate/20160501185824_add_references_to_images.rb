class AddReferencesToImages < ActiveRecord::Migration
  def change
    add_reference :images, :listing, index: true, foreign_key: true
  end
end
