class Task < ActiveRecord::Base
  attr_accessible :completed, :order, :title

  def to_json(options = {})
    super(options.merge(:only => [:id, :completed, :order, :title]))
  end
end
