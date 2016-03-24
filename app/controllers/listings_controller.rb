require 'securerandom'

class ListingsController < ApplicationController
  
  before_action(:find_listing, only: [:edit, :show, :update, :destroy])

  def index
  end

  def show
  end

  def update
    # Block update requests if can_edit didn't pass
    # Is this syntax correct? This is ror, who the f knows ;D
    return head(:bad_request) unless @can_edit
  end

  def edit
    if @can_edit
      # Validate this listing if it wasn't already (this happens the first time a user hits this page)
      unless @listing.validated
        @listing.update_attribute(:validated, true)
        @notification = "verified" # For rendering a "verified" notificaiton in the view
      end
    else
      # Incorrect edit key, redirect to show with an error parameter
      # If this happens too many times in a row fromt he same IP (i.e. 10), 
      # then we should temp ban the IP it came from
      redirect_to(action: "show", v: false)
    end
  end

  def new
  end

  # Create new listing from a post request
  def create

    # Respond with error if no categories
    # This should be more extensive, but this will probably never happen so we'll leave it for now
    if !category_params || category_params.empty?
      respond_to do |format|
        format.json { render :json => { status: "bad_request", message: "No categories selected!" } }
      end
    end

    # Create the listing and save it in the db
    @listing = Listing.new( listing_params )
    @listing.save

    # Set secret attributes
    @listing.update_attribute( :validated, false )
    @listing.update_attribute( :secret_key, SecureRandom.hex )

    # Check if the categories exist, create them if they don't, and create the categorization associations
    category_params[:category_names].each do |str|
      # Format the category name string
      name = str.gsub(/[^A-Za-z\s]/, "").strip.downcase
      cat = Category.find_by_name(name) || Category.create({name: name})
      Categorization.create({listing_id: @listing.id, category_id: cat.id})

      # LATER: Category should also get email address from last poster in case we get spam requests
    end

    # Build validation url
    # Not sure how to do this with url_for since it's not a built-in rails action?
    # (sam) not sure whether this is relevant but google: match ':controller(/:action(/:id))', :via => [:get, :post]
    # (sam) also see: http://stackoverflow.com/questions/19063109/link-to-vs-url-for-vs-path-in-rails
    # validate_url = url_for(action: "verify", key: @listing.secret_key)
    validate_url = request.base_url + "/listings/" + @listing.id.to_s + "/verify/?key=" + @listing.secret_key

    # FOR TESTING -- Remove this in production
    puts "VALIDATION URL: " + validate_url
    
    # Send validation email
    UserMailer.verify_email( @listing, validate_url ).deliver_now

    # Send success response
    respond_to do |format|
      format.json { render :json => { status: "ok", message: "Listing created successfully!" } }
    end

  end

  def destroy
  end

  # Send verify to the edit page which does the validation
  # We just want to use /verify in the email link to emphasize that users must visit this page at least once
  def verify
    redirect_to(action: "edit", key: params[:key])
  end


  ##########################################
  private

    def check_key
      @listing.secret_key == params[:key]
    end

    def find_listing
      @listing = Listing.find_by_id( params[:id] )
      @can_view = !!@listing && @listing.validated
      @can_edit = !!@listing && check_key
    end

    def listing_params
      params.permit(:title, :author, :email, :zipcode, :address, :price, :currency, :condition, :description)
    end

    def category_params
      params.permit(category_names: [])
    end


end

