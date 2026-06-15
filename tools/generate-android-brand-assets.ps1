Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = 'Stop'
$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$res = Join-Path $root 'android/app/src/main/res'

function New-Brush($hex) {
    return [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml($hex))
}

function Draw-RoundedRect($graphics, $brush, [float]$x, [float]$y, [float]$w, [float]$h, [float]$r) {
    $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
    $d = $r * 2
    $path.AddArc($x, $y, $d, $d, 180, 90)
    $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
    $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
    $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
    $path.CloseFigure()
    $graphics.FillPath($brush, $path)
    $path.Dispose()
}

function New-Canvas([int]$width, [int]$height) {
    $bmp = [System.Drawing.Bitmap]::new($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    return @($bmp, $g)
}

function Save-Png($bmp, $path) {
    $dir = Split-Path $path -Parent
    if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
}

function Draw-BrandScene($graphics, [int]$width, [int]$height, [bool]$splash) {
    $rect = [System.Drawing.Rectangle]::new(0, 0, $width, $height)
    $bg = [System.Drawing.Drawing2D.LinearGradientBrush]::new($rect,
        [System.Drawing.ColorTranslator]::FromHtml('#FF8C42'),
        [System.Drawing.ColorTranslator]::FromHtml('#16C7E8'),
        [System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal)
    $graphics.FillRectangle($bg, $rect)
    $bg.Dispose()

    $road = [System.Drawing.PointF[]]@(
        [System.Drawing.PointF]::new($width * 0.18, $height * 0.95),
        [System.Drawing.PointF]::new($width * 0.42, $height * 0.26),
        [System.Drawing.PointF]::new($width * 0.58, $height * 0.26),
        [System.Drawing.PointF]::new($width * 0.82, $height * 0.95)
    )
    $roadBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new($rect,
        [System.Drawing.ColorTranslator]::FromHtml('#19345F'),
        [System.Drawing.ColorTranslator]::FromHtml('#2A174D'),
        [System.Drawing.Drawing2D.LinearGradientMode]::Vertical)
    $graphics.FillPolygon($roadBrush, $road)
    $roadBrush.Dispose()

    $lanePen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(180, 255, 245, 160), [Math]::Max(2, $width * 0.012))
    $graphics.DrawLine($lanePen, $width * 0.43, $height * 0.31, $width * 0.34, $height * 0.88)
    $graphics.DrawLine($lanePen, $width * 0.57, $height * 0.31, $width * 0.66, $height * 0.88)
    $lanePen.Dispose()

    $doorColors = @('#FFD166', '#7CFFB2', '#FF4D8D')
    for ($i = 0; $i -lt 3; $i++) {
        $cx = $width * (0.34 + ($i * 0.16))
        $doorW = $width * 0.13
        $doorH = $height * 0.34
        $x = $cx - ($doorW / 2)
        $y = $height * 0.28
        $shadow = New-Brush '#000000'
        $shadow.Color = [System.Drawing.Color]::FromArgb(65, 0, 0, 0)
        Draw-RoundedRect $graphics $shadow ($x + $width * 0.012) ($y + $height * 0.018) $doorW $doorH ($width * 0.02)
        $shadow.Dispose()
        $door = New-Brush $doorColors[$i]
        Draw-RoundedRect $graphics $door $x $y $doorW $doorH ($width * 0.02)
        $door.Dispose()
        $innerPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(160, 255, 255, 255), [Math]::Max(1, $width * 0.009))
        $graphics.DrawRectangle($innerPen, $x + $doorW * 0.18, $y + $doorH * 0.16, $doorW * 0.64, $doorH * 0.68)
        $innerPen.Dispose()
        $knob = New-Brush '#24344D'
        $graphics.FillEllipse($knob, $x + $doorW * 0.67, $y + $doorH * 0.52, $doorW * 0.12, $doorW * 0.12)
        $knob.Dispose()
    }

    $runner = New-Brush '#FFFFFF'
    $graphics.FillEllipse($runner, $width * 0.43, $height * 0.67, $width * 0.14, $width * 0.14)
    $runner.Dispose()
    $runnerAccent = New-Brush '#2A174D'
    $graphics.FillEllipse($runnerAccent, $width * 0.47, $height * 0.705, $width * 0.025, $width * 0.025)
    $graphics.FillEllipse($runnerAccent, $width * 0.515, $height * 0.705, $width * 0.025, $width * 0.025)
    $runnerAccent.Dispose()

    if ($splash) {
        $fontSize = [Math]::Max(24, [int]($width * 0.065))
        $font = [System.Drawing.Font]::new('Arial', $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
        $format = [System.Drawing.StringFormat]::new()
        $format.Alignment = [System.Drawing.StringAlignment]::Center
        $format.LineAlignment = [System.Drawing.StringAlignment]::Center
        $textShadow = New-Brush '#24344D'
        $textRectShadow = [System.Drawing.RectangleF]::new(3, $height * 0.09 + 3, $width, $fontSize * 1.4)
        $graphics.DrawString('Door Runner Memory', $font, $textShadow, $textRectShadow, $format)
        $textShadow.Dispose()
        $textBrush = New-Brush '#FFFFFF'
        $textRect = [System.Drawing.RectangleF]::new(0, $height * 0.09, $width, $fontSize * 1.4)
        $graphics.DrawString('Door Runner Memory', $font, $textBrush, $textRect, $format)
        $textBrush.Dispose()
        $font.Dispose()
        $format.Dispose()
    }
}

function Write-Icon($path, [int]$size, [bool]$round) {
    $canvas = New-Canvas $size $size
    $bmp = $canvas[0]
    $g = $canvas[1]
    Draw-BrandScene $g $size $size $false
    if ($round) {
        $mask = [System.Drawing.Drawing2D.GraphicsPath]::new()
        $mask.AddEllipse(0, 0, $size, $size)
        $out = [System.Drawing.Bitmap]::new($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
        $og = [System.Drawing.Graphics]::FromImage($out)
        $og.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
        $og.SetClip($mask)
        $og.DrawImage($bmp, 0, 0, $size, $size)
        $og.Dispose()
        $mask.Dispose()
        Save-Png $out $path
        $out.Dispose()
    } else {
        Save-Png $bmp $path
    }
    $g.Dispose()
    $bmp.Dispose()
}

function Write-Splash($path, [int]$width, [int]$height) {
    $canvas = New-Canvas $width $height
    $bmp = $canvas[0]
    $g = $canvas[1]
    Draw-BrandScene $g $width $height $true
    Save-Png $bmp $path
    $g.Dispose()
    $bmp.Dispose()
}

$icons = @{
    'mipmap-mdpi' = 48
    'mipmap-hdpi' = 72
    'mipmap-xhdpi' = 96
    'mipmap-xxhdpi' = 144
    'mipmap-xxxhdpi' = 192
}

foreach ($entry in $icons.GetEnumerator()) {
    $dir = Join-Path $res $entry.Key
    Write-Icon (Join-Path $dir 'ic_launcher.png') $entry.Value $false
    Write-Icon (Join-Path $dir 'ic_launcher_round.png') $entry.Value $true
    Write-Icon (Join-Path $dir 'ic_launcher_foreground.png') ([int]($entry.Value * 2.25)) $false
}

$splashes = @{
    'drawable/splash.png' = @(480, 320)
    'drawable-land-mdpi/splash.png' = @(480, 320)
    'drawable-land-hdpi/splash.png' = @(800, 480)
    'drawable-land-xhdpi/splash.png' = @(1280, 720)
    'drawable-land-xxhdpi/splash.png' = @(1600, 960)
    'drawable-land-xxxhdpi/splash.png' = @(1920, 1280)
    'drawable-port-mdpi/splash.png' = @(320, 480)
    'drawable-port-hdpi/splash.png' = @(480, 800)
    'drawable-port-xhdpi/splash.png' = @(720, 1280)
    'drawable-port-xxhdpi/splash.png' = @(960, 1600)
    'drawable-port-xxxhdpi/splash.png' = @(1280, 1920)
}

foreach ($entry in $splashes.GetEnumerator()) {
    $dims = $entry.Value
    Write-Splash (Join-Path $res $entry.Key) $dims[0] $dims[1]
}

Write-Host "Generated Android launcher and splash placeholder branding assets."
