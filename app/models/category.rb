class Category < ActiveRecord::Base
  has_many :categorizations
  has_many :listings, through: :categorizations
end
