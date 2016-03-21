require 'securerandom'

class ListingsController < ApplicationController
  
  before_action(:find_listing, only: [:edit, :show, :update, :destroy, :validate])

  def index
  end

  def show
  end

  def update
  end

  def edit
  end

  def new
  end

  # Create new listing
  def create

    # Respond with error if no categories
    # This should be more extensive, but this will probably never happen so we'll leave it for now
    # if !category_params || category_params.empty?
    #   respond_to do |format|
    #     format.json { render :json => { status: "bad_request", message: "No categories selected!" } }
    #   end
    # end

    byebug

    # Create the listing and save it in the db
    @listing = Listing.new( listing_params )
    @listing.save

    @listing.update_attribute( :validated, false )
    @listing.update_attribute( :secret_key, SecureRandom.hex )

    # Check if the categories exist, create them if they don't, and create the categorization associations
    category_params[:category_names].each do |n|
      # Format the category name string
      n.gsub!(/[^A-Za-z\s]/, "").strip!.downcase!
      cat = Category.find_by_name(n) || Category.create({name: n})
      categorization = Categorization.create({listing_id: @listing.id, category_id: cat.id})
    end


    # Build validation url
    # site_url = "???"
    # validate_route = "???"
    # validate_url = site_url + validate_route + "?key=" + @listing.secret_key

    # Build validation email html
    
    # Send validation email


    # Send success response
    respond_to do |format|
      format.json { render :json => { status: "ok", message: "Listing created successfully!" } }
    end

  end

  def destroy
  end

  # Validate a listing from email link
  def validate
    if @listing.secret_key == params[:key]
      @listing.update_attribute(:validated, true)
    else
      # Failed to validate listing, return some kind of error
    end
  end

  private

    def find_listing
      @listing = Listing.find( params[:id] )
    end

    def listing_params
      params.permit(:title, :author, :email, :zipcode, :address, :price, :currency, :condition, :description)
    end

    def category_params
      params.permit(category_names: [])
    end

end

