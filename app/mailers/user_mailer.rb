class UserMailer < ApplicationMailer

  def verify_email( listing, url )
    @listing = listing
    @verification_url = url
    mail( to: %("#{@listing.author}" <#{@listing.email}>), subject: 'Verify your bitlist post: "' + @listing.title + '"' )
  end

end
