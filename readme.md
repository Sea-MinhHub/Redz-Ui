The Redz mod ui by *Sea | Minh Hub* 
Ex code in file Ex.lua

***Load ui*** : 
```
local Redzmodbyseaminh = loadstring(game:HttpGet("https://raw.githubusercontent.com/Sea-MinhHub/Redz-Ui/main/Redz%20Ui%20by%20Sea%20%7C%20Minh%20Hub"))()
```

***create Ui***
```
local Redzmodbyseaminh = Redzmodbyseaminh:MakeWindow({
    ["Title"] = "Sea | Minh Hub",
    ["SubTitle"] = "by Sea | Minh Hub",
    ["ScriptFolder"] = "SeaMinhHubOther"
})
```
***create tab*** 
```
local MainTab = Redzmodbyseaminh:MakeTab({
    "Discord",
    "rbxassetid://10723415903"
})
```
***add discord*** 
```
MainTab:AddDiscordInvite({
    ["Title"] = "Sea | Minh Hub",
    ["Description"] = "Đây là discord chính chủ của Sea | Minh Hub.",
    ["Banner"] = "rbxassetid://0",
    ["Logo"] = "rbxassetid://107169193664829",
    ["Invite"] = "https://discord.gg/8G2bQPz2eH",
    ["Members"] = 0,
    ["Online"] = 0
})
```
**add section***
```
MainTab:AddSection("Section Title")
```
***add toggle***
```
MainTab:AddToggle({
    ["Name"] = "Toggle Name",
    ["Flag"] = "ToggleFlag1",
    ["Default"] = false,
    ["Callback"] = function(v)
        _G.Value = v
    end
})
```
***slider***
```
MainTab:AddSlider({
    ["Name"] = "Slider Name",
    ["Min"] = 0,
    ["Max"] = 100,
    ["Default"] = 50,
    ["Increment"] = 1,
    ["Callback"] = function(v)
        print(v)
    end
})
```
***add dropdown***
```
MainTab:AddDropdown({
    ["Name"] = "Dropdown Name",
    ["Options"] = {"Option 1", "Option 2", "Option 3"},
    ["Default"] = "Option 1",
    ["Callback"] = function(v)
        print(v)
    end
})
```
***add text box*** 
```
MainTab:AddTextBox({
    ["Name"] = "TextBox Name",
    ["Default"] = "",
    ["PlaceholderText"] = "Input here...",
    ["Callback"] = function(v)
        print(v)
    end
})
```
***add paragraph***
```
local Paragraph = MainTab:AddParagraph("Title", "Content text")
```
***add color picker***
```
MainTab:AddColorPicker({
    ["Name"] = "Color Picker",
    ["Default"] = Color3.fromRGB(255, 0, 0),
    ["Callback"] = function(v)
        print(v)
    end
})
```
***New Minimizer***
```
Window:NewMinimizer({
    ["KeyCode"] = Enum.KeyCode.LeftControl
}):CreateMobileMinimizer({
    ["Image"] = "rbxassetid://87245917237197",
    ["BackgroundColor3"] = Color3.fromRGB(0, 0, 0)
})
```
***add bind*** 
```
MainTab:AddBind({
    ["Name"] = "Keybind Name",
    ["Default"] = Enum.KeyCode.RightControl,
    ["Hold"] = false,
    ["Callback"] = function()
        print("Key Pressed")
    end
})
```
***Notify***
```
Redzmodbyseaminh:Notify({
    ["Title"] = "Notification",
    ["Content"] = "Script Loaded Successfully",
    ["Image"] = "rbxassetid://10723415903",
    ["Delay"] = 5
})
```
