require 'sinatra'
require 'babel/transpiler'

def babel(filepath)
  `npx babel --presets @babel/preset-react #{filepath}`
end

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
  filepath = filepath(filename)

  unless File.exists?(filepath)
    status 404
    return
  end

  if extension == ".js"
    file_contents = babel(filepath)
  else
    file_contents = File.read(filepath, { mode: "rb" })
  end

  body file_contents
  content_type Rack::Mime.mime_type(extension)
  status 200
end
