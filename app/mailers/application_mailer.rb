class ApplicationMailer < ActionMailer::Base
  default from: "no-reply@bitlist.com"
  layout 'mailer'
end
