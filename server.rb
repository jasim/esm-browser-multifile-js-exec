require 'sinatra'

def filepath(filename)
  "uploads/#{filename}"
end

post '/:filename' do
  filename = params[:filename]
  body = request.body.read
  File.open(filepath(filename), "wb") do |file|
    file.write body
    status 200
    body "File created. #{filename}"
  end
end

get '/:filename' do
  filename = params[:filename]

  extension = File.extname(filename).downcase
  # remove the . in .css
  if extension.length > 1
    extension = extension[1..-1]
  end

  mime_type = MIME::Types.type_for(extension)

  file_contents = File.read(filepath(filename), "b")

  if extension == "js"
    file_contents = babel(file_contents)
  end

  body file_contents
  content_type mime_type
  status 200
end
