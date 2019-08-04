function initiate($template_uri){
    $loc = Get-Location
    mkdir $loc\esp-engine
    Invoke-WebRequest -Uri $template_uri -OutFile $loc\esp-engine\template.zip
    Expand-Archive $loc\esp-engine\template.zip $loc\esp-engine
    mv $loc\esp-engine\esp-idf-template-master\* $loc\
}