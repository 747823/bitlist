class Listing < ActiveRecord::Base
  has_many :categorizations
  has_many :categories, through: :categorizations
  has_many :images

  before_create :init

  def init
    self.validated = false
    self.secret_key = SecureRandom.hex
  end
end
