local Library = loadstring(game:HttpGet("https://raw.githubusercontent.com/htzgamingssr/Spawn-Hub/refs/heads/main/Main-Gui-V5.lua"))()

local Window = Library:MakeWindow({
    ["Title"] = "Sea | Minh Hub",
    ["SubTitle"] = "by Sea | Minh Hub",
    ["ScriptFolder"] = "SeaMinhHubOther"
})

Library:Notify({
    ["Title"] = "Notification",
    ["Content"] = "Script Loaded Successfully",
    ["Image"] = "rbxassetid://10723415903",
    ["Delay"] = 5
})

local MainTab = Window:MakeTab({
    "Main",
    "rbxassetid://10723407389"
})

MainTab:AddDiscordInvite({
    ["Name"] = "Discord Server",
    ["Logo"] = "rbxassetid://10723415903",
    ["Invite"] = "https://discord.gg/8G2bQPz2eH"
})

MainTab:AddSection("Section Title")

MainTab:AddButton({
    ["Name"] = "Button Name",
    ["Callback"] = function()
        print("Clicked")
    end
})

MainTab:AddToggle({
    ["Name"] = "Toggle Name",
    ["Flag"] = "ToggleFlag1",
    ["Default"] = false,
    ["Callback"] = function(v)
        _G.Value = v
    end
})

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

MainTab:AddDropdown({
    ["Name"] = "Dropdown Name",
    ["Options"] = {"Option 1", "Option 2", "Option 3"},
    ["Default"] = "Option 1",
    ["Callback"] = function(v)
        print(v)
    end
})

MainTab:AddTextBox({
    ["Name"] = "TextBox Name",
    ["Default"] = "",
    ["PlaceholderText"] = "Input here...",
    ["Callback"] = function(v)
        print(v)
    end
})

local Paragraph = MainTab:AddParagraph("Title", "Content text")

MainTab:AddColorPicker({
    ["Name"] = "Color Picker",
    ["Default"] = Color3.fromRGB(255, 0, 0),
    ["Callback"] = function(v)
        print(v)
    end
})

MainTab:AddBind({
    ["Name"] = "Keybind Name",
    ["Default"] = Enum.KeyCode.RightControl,
    ["Hold"] = false,
    ["Callback"] = function()
        print("Key Pressed")
    end
})

Window:NewMinimizer({
    ["KeyCode"] = Enum.KeyCode.LeftControl
}):CreateMobileMinimizer({
    ["Image"] = "rbxassetid://87245917237197",
    ["BackgroundColor3"] = Color3.fromRGB(0, 0, 0)
})
